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
import fetch from 'node-fetch'; // You'll need to install this
import IApiError from "./errors/IApiError";
import ApiErrorFactory from "./errors/ApiErrorFactory";
import API_ERROR_CODES from "./errors/API_ERROR_CODES";

export type RedisClientConnection = ReturnType<typeof createClient>;

export default function createProxyServer(config: {
    port: 3100 | 4200;
    middleware: Array<(req: Request, res: Response, next: NextFunction) => void>;
    mode: "PRODUCTION" | "DEVELOPMENT" | "DOCKER";
    diContainer: IDIContainer;
    redis: RedisClientConnection;
}) {
    const { redis } = config;
    const app = express();
    app.options("*", cors());
    app.use(cors());

    app.use(express.urlencoded({ extended: false }));
    config.middleware.forEach((middleware) => {
        app.use(middleware);
    });

    const authDataAccess = new AuthDataAccess();
    const draftImageDataAccess = new DraftImageDataAccess();
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

        const response = await fetch("http://127.0.0.1:4300/upload", {
            method: 'POST',
            body: formData,
            headers: {
              ...formData.getHeaders(),
            }
          });
          
        const httpService = new ExpressHttpService(req);

        if (response.status === 200) {
            try {
                const responseJson: UploadImagesResponseDTO = await response.json() as any;
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
                    const apiErrors: IApiError[] = ApiErrorFactory.createSingleErrorList({ message: "Something went wrong trying to persist image data", code: API_ERROR_CODES.VALIDATION_ERROR, path: "_" })
                    res.status(400).json(apiErrors);
                } else {
                    res.status(200).json(responseJson);
                }
            } catch (e: unknown) {
                console.log("Ezzor: ", e);
                const apiErrors: IApiError[] = ApiErrorFactory.createSingleErrorList({ message: "Something went wrong trying to persist image data", code: API_ERROR_CODES.VALIDATION_ERROR, path: "_" })
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
            target: "http://localhost:5102",
            selfHandleResponse: false,
            changeOrigin: true,
            timeout: 10000,
            proxyTimeout: 10000,
        }),
    );

    app.use("/media", express.static("media"));
    app.use("/static", express.static("static"));
    app.use(errorLogger);

    app.use(express.static(STATIC_DIR));

    return app;
}
