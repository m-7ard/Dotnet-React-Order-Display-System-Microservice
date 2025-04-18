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

export type RedisClientConnection = ReturnType<typeof createClient>

export default function createApplication(config: {
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
    const tokenRepository = new RedisTokenRepository(redis);

    const authRouter = Router();

    registerAction({ 
        router: authRouter, 
        initialiseAction: () => new LogoutAction(authDataAccess, tokenRepository), 
        method: "POST",
        path: "/logout",
        guards: [express.json({ limit: "1mb" })]
    })
    
    app.use(authRouter);

    app.use(validateTokenMiddlewareFactory({ tokenRepository: tokenRepository, authDataAccess: authDataAccess }));

    app.post("/upload", createProxyMiddleware({
        target: "http://127.0.0.1:4300",
        changeOrigin: true,
        selfHandleResponse: true,
        on: {
            proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
                if (proxyRes.statusCode === 200) {
                    const responseJson = JSON.parse(responseBuffer.toString('utf8'));
                    console.log(responseJson);
                }
                
                return responseBuffer;
            })
        },
        timeout: 10000, // 10 seconds
        proxyTimeout: 10000, // 10 seconds
    }))

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
