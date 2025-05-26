import express, { NextFunction, Request, Response } from "express";
import errorLogger from "./middleware/errorLogger";
import cors from "cors";
import { IDIContainer } from "./services/DIContainer";
import { STATIC_DIR } from "config";
import multer from "multer";

export default function createSecretsServer(config: { middleware: Array<(req: Request, res: Response, next: NextFunction) => void>; diContainer: IDIContainer; }) {
    const app = express();
    app.options("*", cors());
    app.use(cors());

    app.use(express.urlencoded({ extended: false }));
    config.middleware.forEach((middleware) => {
        app.use(middleware);
    });

    const upload = multer({ storage: multer.memoryStorage() });
    app.post("/upload", upload.array("file"), (req, res) => {

    });

    app.use(errorLogger);

    app.use(express.static(STATIC_DIR));

    return app;
}
