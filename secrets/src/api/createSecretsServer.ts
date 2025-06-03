import express, { NextFunction, Request, Response } from "express";
import errorLogger from "./middleware/errorLogger";
import cors from "cors";
import { IDIContainer } from "./services/DIContainer";
import { STATIC_DIR } from "config";
import { SECRETS } from "index";

export default function createSecretsServer(config: { middleware: Array<(req: Request, res: Response, next: NextFunction) => void>; diContainer: IDIContainer }) {
    const app = express();
    app.options("*", cors());
    app.use(cors());

    app.use(express.urlencoded({ extended: false }));
    config.middleware.forEach((middleware) => {
        app.use(middleware);
    });

    app.get("/health", (req, res) => {
        res.status(200).send("OK");
    });

    app.get("/secrets/:key", (req: Request, res: Response) => {
        try {
            const { key } = req.params;

            if (!SECRETS.hasOwnProperty(key)) {
                return void res.status(404).json({ error: "Secret not found" });
            }

            const typedKey = key as keyof typeof SECRETS;
            console.log(SECRETS[typedKey])

            res.json({
                key,
                value: SECRETS[typedKey],
                retrievedAt: new Date().toISOString(),
            });
        } catch (error) {
            console.error("Error fetching secret:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    app.use(errorLogger);

    app.use(express.static(STATIC_DIR));

    return app;
}
