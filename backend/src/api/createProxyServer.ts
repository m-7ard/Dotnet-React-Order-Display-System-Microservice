import express, { NextFunction, Request, Response, Router } from "express";
import errorLogger from "./middleware/errorLogger";
import cors from "cors";
import { IDIContainer } from "./services/DIContainer";
import { STATIC_DIR } from "config";
import { createProxyMiddleware, responseInterceptor } from "http-proxy-middleware";
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
import CreateTokenCommandHandler from "application/handlers/auth/CreateTokenCommandHandler";
import ReadCachedTokenQueryHandler from "application/handlers/auth/ReadCachedTokenQueryHandler";
import LogoutUserCommandHandler from "application/handlers/auth/LogoutUserCommandHandler";
import JwtTokenGateway from "application/gateways/JwtTokenGateway";
import { TokenValidationService } from "./services/TokenValidationService";

export type RedisClientConnection = ReturnType<typeof createClient>;

export default function createProxyServer(config: {
    port: 3000 | 4200;
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

    app.post(
        "/upload",
        createProxyMiddleware({
            target: "http://127.0.0.1:4300",
            changeOrigin: true,
            selfHandleResponse: true,
            on: {
                proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
                    const httpService = new ExpressHttpService(req);

                    if (proxyRes.statusCode === 200) {
                        try {
                            const responseJson: UploadImagesResponseDTO = JSON.parse(responseBuffer.toString("utf8"));
                            const bearerToken = httpService.getBearerTokenOrThrow();

                            const apiRequest: IUploadDraftImagesRequestDTO = {
                                imageData: responseJson.images.map((data) => ({
                                    fileName: data.fileName,
                                    originalFileName: data.originalFileName,
                                    url: data.url,
                                })),
                            };

                            const apiResponse = await draftImageDataAccess.uploadDraftImages(bearerToken, apiRequest);
                            if (!apiResponse || apiResponse.ok === false) {
                                res.writeHead(400, { "Content-Type": "application/json" });
                                res.end(JSON.stringify({ message: "Something went wrong trying to persist image data" }));
                                return Buffer.from("");
                            }
                        } catch (e: unknown) {
                            res.writeHead(400, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ message: "Something went wrong trying to persist image data" }));
                            return Buffer.from("");
                        }
                    }

                    return responseBuffer;
                }),
            },
            timeout: 10000, // 10 seconds
            proxyTimeout: 10000, // 10 seconds
        }),
    );

    app.use(
        createProxyMiddleware({
            target: "http://localhost:5102",
            selfHandleResponse: false,
            changeOrigin: true,
            timeout: 10000, // 10 seconds
            proxyTimeout: 10000, // 10 seconds
        }),
    );

    app.use("/media", express.static("media"));
    app.use("/static", express.static("static"));
    app.use(errorLogger);

    app.use(express.static(STATIC_DIR));

    return app;
}
