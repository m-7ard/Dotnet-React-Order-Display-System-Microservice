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
import { Kafka } from "kafkajs";
import { WebSocketServer, WebSocket } from "ws";
import { Channel } from "amqplib";
import QueueService from "infrastructure/services/QueueService";
import RegisterUserCommandHandler from "application/handlers/auth/RegisterUserCommandHandler";
import RegisterAction from "./actions/auth/RegisterAction";
import RawEvent from "./events/RawEvent";
import EVENT_TYPES from "./events/EVENT_TYPES";
import AuthenticateUserEvent, { AuthenticateUserPayload } from "./events/websockets/AuthenticateUserEvent";
import AbstractEvent from "infrastructure/events/AbstractEvent";
import OrderEventPayload from "./events/orders/OrderEventPayload";

export type RedisClientConnection = ReturnType<typeof createClient>;

export default function createProxyServer(config: {
    middleware: Array<(req: Request, res: Response, next: NextFunction) => void>;
    diContainer: IDIContainer;
    redis: RedisClientConnection;
    authServerUrl: string;
    fileServerUrl: string;
    mainAppServerUrl: string;
    websocketServerHost: string;
    kafka: Kafka;
    channel: Channel;
}) {
    const { redis, authServerUrl, fileServerUrl, mainAppServerUrl, kafka, websocketServerHost, channel } = config;
    const app = express();
    app.options("*", cors());
    app.use(cors());

    const wss = new WebSocketServer({
        port: 8080,
        host: websocketServerHost,
    });

    // userSocketRegistry's key is a user id
    const socketRegistry = new Map<WebSocket, { timeoutFn: NodeJS.Timeout }>();
    const userSocketRegistry = new Map<string, Set<WebSocket>>();

    wss.on("connection", (ws) => {
        ws.on("message", async (rawData) => {
            const data: object = JSON.parse(rawData.toString());
            if (!(data.hasOwnProperty("payload") && data.hasOwnProperty("type"))) {
                console.error("Received event of invalid format: ", data);
                return;
            }

            const typedEvent = data as RawEvent;
            if (typedEvent.type === EVENT_TYPES.AUTHENTICATE_USER) {
                const ev = new AuthenticateUserEvent(typedEvent.payload as AuthenticateUserPayload);
                const validation = await tokenValidationService.validateToken(ev.payload.token);
                if (validation.isErr()) {
                    return;
                }

                // Token & date until expiry
                const token = validation.value;
                const timeSpan = token.expiryDate.getTime() - new Date().getTime();

                // This socket's data
                const socketData = socketRegistry.get(ws);

                // All sockets belonging to this authenticated user
                let nullishUserSockets = userSocketRegistry.get(token.userId);
                if (nullishUserSockets == null) {
                    const userSockets = new Set<WebSocket>();
                    userSocketRegistry.set(token.userId, userSockets);
                    nullishUserSockets = userSockets;
                }
                const userSockets = nullishUserSockets!;
                userSockets.add(ws);

                // Closes websocket, deletes socket from registry, removes socket from user sockets
                // and deletes the user entry if there are no more sockets related to user
                const newTimeoutFn = () => {
                    ws.close();
                    socketRegistry.delete(ws);
                    userSockets.delete(ws);
                    if (userSockets.size === 0) {
                        userSocketRegistry.delete(token.userId);
                    }
                };

                const fn = setTimeout(newTimeoutFn, timeSpan);

                if (socketData == null) {
                    socketRegistry.set(ws, { timeoutFn: fn });
                } else {
                    clearTimeout(socketData.timeoutFn);
                    socketData.timeoutFn = fn;
                }
            } else {
                console.error("No handler for event of type: ", typedEvent.type);
            }
        });

        ws.on("close", () => {});
    });

    function broadcast(params: { event: AbstractEvent<object>; message: string }) {
        const { event, message } = params;
        if (event.type.startsWith("orders")) {
            const payload = event.payload as OrderEventPayload;
            const nullishUserSockets = userSocketRegistry.get(payload.userId);
            nullishUserSockets?.forEach((ws) => ws.send(message));
            return;
        }

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
                const rawData = message.value?.toString();
                if (rawData == null) {
                    return;
                }

                try {
                    const event: AbstractEvent<object> = JSON.parse(rawData);
                    broadcast({ event: event, message: rawData });
                } catch (e: unknown) {
                    const timeStamp = `\x1b[33m${new Date().toLocaleTimeString()}\x1b[0m`;
                    console.error(`[${timeStamp}] Consumer failed to parse message: `, rawData);
                }
            },
        });
    }

    consumeMessages().catch(console.error);

    app.use(express.urlencoded({ extended: false }));
    config.middleware.forEach((middleware) => {
        app.use(middleware);
    });

    // dEPENDENCIES
    const authDataAccess = new AuthDataAccess(authServerUrl);
    const draftImageDataAccess = new DraftImageDataAccess(mainAppServerUrl);
    const tokenRepository = new RedisTokenRepository(redis);
    const queueService = new QueueService(channel);
    const jwtTokenGateway = new JwtTokenGateway(tokenRepository, authDataAccess);
    const tokenValidationService = new TokenValidationService(jwtTokenGateway);

    const authRouter = Router();

    // Auth - Logout User
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

    // Auth - Register User
    registerAction({
        router: authRouter,
        initialiseAction: () => {
            const registerUserCommandHandler = new RegisterUserCommandHandler(authDataAccess, queueService);
            return new RegisterAction(registerUserCommandHandler);
        },
        method: "POST",
        path: "/register",
        guards: [express.json({ limit: "1mb" })],
    });

    // Hook up the Auth router
    app.use(authRouter);

    // Authentication Middleware
    // All endpoints below will require authentication
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
            xfwd: true,
            preserveHeaderKeyCase: true,
        }),
    );

    app.use("/media", express.static("media"));
    app.use("/static", express.static("static"));
    app.use(errorLogger);

    app.use(express.static(STATIC_DIR));

    return app;
}
