import express, { NextFunction, Request, Response } from "express";
import errorLogger from "./middleware/errorLogger";
import cors from "cors";
import { IDIContainer } from "./services/DIContainer";
import { STATIC_DIR } from "config";
import { createProxyMiddleware } from "http-proxy-middleware";
import { createClient, RedisClientType  } from "redis";

export type RedisClientConnection = ReturnType<typeof createClient>

export default function createApplication(config: {
    port: 3000 | 4200;
    middleware: Array<(req: Request, res: Response, next: NextFunction) => void>;
    mode: "PRODUCTION" | "DEVELOPMENT" | "DOCKER";
    diContainer: IDIContainer;
    redis: RedisClientConnection;
    authUrl: string;
}) {
    const { redis } = config;
    const app = express();
    app.options("*", cors());
    app.use(cors());

    // app.use(express.json({ limit: 1028 ** 2 * 100 }));
    app.use(express.urlencoded({ extended: false }));
    config.middleware.forEach((middleware) => {
        app.use(middleware);
    });

    app.all("*", async (req, res, next) => {
        const keys = await redis.keys('*');
        console.log(keys)
        const authHeader = req.headers['authorization'];
        if (authHeader == null) {
            res.status(401).send();
            return;
        }

        const [_, token] = authHeader.split(" ");
        if (token == null) {
            res.status(401).send();
            return;
        }

        const expirationTimestamp = await redis.get(token);
        if (expirationTimestamp != null) {
            const expirationDate = new Date(expirationTimestamp);
            console.log(expirationDate, new Date())
            if (expirationDate > new Date()) {
                await redis.del(token);
                next();
                return;
            }
        }

        const response = await fetch(`${config.authUrl}/validate-token`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': authHeader
            },
        });

        const data: {
            valid: boolean;
            expiration: string;
        } = await response.json();

        if (response.ok && data.valid) {
            const EX = Math.floor((new Date(data.expiration).getTime() - Date.now()) / 1000);
            console.log(EX)
            await redis.set(token, data.expiration, {
                EX: EX
            });

            next();
            return;
        }

        res.status(401).send();
    });

    app.use(
        createProxyMiddleware({
            target: "http://localhost:5102",
            selfHandleResponse: false,
            changeOrigin: true, // Changes the origin of the host header to the target URL
        }),
    );

    app.use("/media", express.static("media"));
    app.use("/static", express.static("static"));
    app.use(errorLogger);

    app.use(express.static(STATIC_DIR));

    return app;
}
