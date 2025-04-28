import express, { NextFunction, Request, Response, Router } from "express";
import errorLogger from "./middleware/errorLogger";
import cors from "cors";
import { IDIContainer } from "./services/DIContainer";
import { STATIC_DIR } from "config";
import { createProxyMiddleware } from "http-proxy-middleware";
import { createClient } from "redis";
import { validateTokenMiddlewareFactory } from "./middleware/validateTokenMiddleware";
import AuthDataAccess from "infrastructure/dataAccess/AuthDataAccess";
import RedisTokenRepository from "infrastructure/persistence/RedisTokenRepository";
import registerAction from "./utils/registerAction";
import LogoutAction from "./actions/auth/LogoutAction";
import DraftImageDataAccess from "infrastructure/dataAccess/DraftImageDataAccess";
import { UploadImagesResponseDTO } from "infrastructure/contracts/fileServer/upload-images/UploadImagesResponseDTO";
import IUploadDraftImagesRequestDTO from "infrastructure/contracts/draftImages/upload/IUploadDraftImagesRequestDTO";
import ExpressHttpService from "./services/ExpressHttpService";
import LogoutUserCommandHandler from "application/handlers/auth/LogoutUserCommandHandler";
import JwtTokenGateway from "application/gateways/JwtTokenGateway";
import { TokenValidationService } from "./services/TokenValidationService";
import multer from "multer";
import FormData from "form-data";
import fetch from "node-fetch";
import IApiError from "./errors/IApiError";
import ApiErrorFactory from "./errors/ApiErrorFactory";
import API_ERROR_CODES from "./errors/API_ERROR_CODES";
import { Kafka, Producer } from "kafkajs";
import { WebSocketServer, WebSocket } from "ws";

export type RedisClientConnection = ReturnType<typeof createClient>;

export default function createProxyServer(config: {
    middleware: Array<(req: Request, res: Response, next: NextFunction) => void>;
    diContainer: IDIContainer;
    redis: RedisClientConnection;
    authServerUrl: "http://127.0.0.1:8000" | "http://auth:8000";
    fileServerUrl: "http://127.0.0.1:4300" | "http://127.0.0.1:3000" | "http://file:3000";
    mainAppServerUrl: "http://localhost:5102" | "http://web:5000";
    kafka: Kafka;
}) {
    const { redis, authServerUrl, fileServerUrl, mainAppServerUrl, kafka } = config;
    const app = express();
    app.options("*", cors());
    app.use(cors());

    const wss = new WebSocketServer({ port: 8080 });

    // async function sendMessage() {
    //     await kafkaProducer.connect();
    //
    //     // Send a message to the 'orders' topic
    //     await kafkaProducer.send({
    //         topic: "orders",
    //         messages: [{ value: JSON.stringify({ message: "Hello from producer!", timestamp: new Date().toISOString() }) }],
    //     });
    //
    //     console.log("Message sent!");
    //     // Keep connection open for continuous messaging or close it
    //     // await producer.disconnect();
    // }
    //
    // // Send a message every 5 seconds
    // setInterval(sendMessage, 5000);

    wss.on("connection", (ws) => {
        console.log("Client connected");

        ws.on("message", (message) => {
            console.log(`Received: ${message}`);
            ws.send(`Echo: ${message}`);
        });

        ws.on("close", () => {
            console.log("Client disconnected");
        });

        ws.send("Welcome to the WebSocket server!");
    });

    function broadcast(message: any) {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    async function consumeMessages() {
        const consumer = kafka.consumer({
            groupId: "websocket-group",
            retry: {
                retries: 10,
                initialRetryTime: 300,
                maxRetryTime: 30000,
                factor: 0.2,
                multiplier: 2,
            },
        });

        await consumer.connect();
        await consumer.subscribe({ topic: "orders", fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                broadcast(message.value?.toString());
            },
        });
    }

    consumeMessages().catch(console.error);

    app.use(express.urlencoded({ extended: false }));
    config.middleware.forEach((middleware) => {
        app.use(middleware);
    });

    const authDataAccess = new AuthDataAccess(authServerUrl);
    const draftImageDataAccess = new DraftImageDataAccess(mainAppServerUrl);
    const tokenRepository = new RedisTokenRepository(redis);

    const authRouter = Router();

    registerAction({
        router: authRouter,
        initialiseAction: () => {
            const logoutUserCommandHandler = new LogoutUserCommandHandler(authDataAccess, tokenRepository);
            return new LogoutAction(logoutUserCommandHandler);
        },
        method: "POST",
        path: "/logout",
        guards: [express.json({ limit: "1mb" })],
    });

    app.use(authRouter);

    app.use((req: Request, res: Response, next: NextFunction) => {
        const gateway = new JwtTokenGateway(tokenRepository, authDataAccess);
        const tokenService = new TokenValidationService(gateway);
        const middleware = validateTokenMiddlewareFactory({ tokenValidationService: tokenService });
        return middleware(req, res, next);
    });
    const upload = multer();

    app.post("/upload", upload.any(), async (req, res) => {
        const formData = new FormData();

        Object.entries(req.body).forEach(([key, value]) => {
            formData.append(key, value as any);
        });

        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            req.files.forEach((file) => {
                formData.append(file.fieldname, file.buffer, {
                    filename: file.originalname,
                    contentType: file.mimetype,
                });
            });
        }

        const response = await fetch(`${fileServerUrl}/upload`, {
            method: "POST",
            body: formData,
            headers: {
                ...formData.getHeaders(),
            },
        });

        const httpService = new ExpressHttpService(req);

        if (response.status === 200) {
            try {
                const responseJson: UploadImagesResponseDTO = (await response.json()) as any;
                const bearerToken = httpService.getBearerTokenOrThrow();
                const clientHeader = httpService.getClientHeaderOrThrow();

                const apiRequest: IUploadDraftImagesRequestDTO = {
                    imageData: responseJson.images.map((data) => ({
                        fileName: data.fileName,
                        originalFileName: data.originalFileName,
                        url: data.url,
                    })),
                };

                const apiResponse = await draftImageDataAccess.uploadDraftImages(clientHeader, bearerToken, apiRequest);

                if (!apiResponse.ok) {
                    const apiErrors: IApiError[] = ApiErrorFactory.createSingleErrorList({
                        message: "Something went wrong trying to persist image data",
                        code: API_ERROR_CODES.VALIDATION_ERROR,
                        path: "_",
                    });
                    res.status(400).json(apiErrors);
                } else {
                    res.status(200).json(responseJson);
                }
            } catch (e: unknown) {
                const apiErrors: IApiError[] = ApiErrorFactory.createSingleErrorList({
                    message: "Something went wrong trying to persist image data",
                    code: API_ERROR_CODES.VALIDATION_ERROR,
                    path: "_",
                });
                res.status(400).json(apiErrors);
            }

            return;
        }

        try {
            const body = await response.json();
            res.status(response.status).json(body);
        } catch (e) {
            res.status(response.status).json();
        }

        return;
    });

    app.use(
        createProxyMiddleware({
            target: process.env.NODE_ENV === "DOCKER" ? "http://web:5000" : "http://localhost:5102",
            selfHandleResponse: false,
            changeOrigin: true,
            timeout: 10000,
            proxyTimeout: 10000,
            xfwd: true, // IMPORTANT: sets X-Forwarded-For, X-Forwarded-Proto, Host, etc.
            preserveHeaderKeyCase: true,
        }),
    );

    app.use("/media", express.static("media"));
    app.use("/static", express.static("static"));
    app.use(errorLogger);

    app.use(express.static(STATIC_DIR));

    return app;
}
