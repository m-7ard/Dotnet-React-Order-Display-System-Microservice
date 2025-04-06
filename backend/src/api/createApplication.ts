import express, { NextFunction, Request, Response } from "express";
import errorLogger from "./middleware/errorLogger";
import cors from "cors";
import path from "path";
import { IDIContainer } from "./services/DIContainer";
import { STATIC_DIR, DIST_DIR } from "config";
import { createProxyMiddleware } from "http-proxy-middleware";

export default function createApplication(config: {
    port: 3000 | 4200;
    middleware: Array<(req: Request, res: Response, next: NextFunction) => void>;
    mode: "PRODUCTION" | "DEVELOPMENT" | "DOCKER";
    diContainer: IDIContainer;
}) {
    const app = express();
    app.options("*", cors());
    app.use(cors());

    // app.use(express.json({ limit: 1028 ** 2 * 100 }));
    app.use(express.urlencoded({ extended: false }));
    config.middleware.forEach((middleware) => {
        app.use(middleware);
    });

    app.all("*", (req, res, next) => {
        console.log(req.headers)
        next();
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
