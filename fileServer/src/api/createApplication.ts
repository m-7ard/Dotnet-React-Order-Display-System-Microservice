import express, { NextFunction, Request, Response } from "express";
import errorLogger from "./middleware/errorLogger";
import cors from "cors";
import { IDIContainer } from "./services/DIContainer";
import { MEDIA_FOLDER_NAME, MEDIA_ROOT, STATIC_DIR } from "config";
import multer from "multer";
import { StatusCodes } from "http-status-codes";
import ApiErrorFactory from "./errors/ApiErrorFactory";
import IApiError from "./errors/IApiError";
import { UploadImagesResponseDTO } from "./contracts/upload-images/UploadImagesResponseDTO";
import path from "path";
import { writeFileSync } from "fs";
import API_ERROR_CODES from "./errors/API_ERROR_CODES";

export default function createApplication(config: {
    port: 3000 | 4300;
    middleware: Array<(req: Request, res: Response, next: NextFunction) => void>;
    mode: "PRODUCTION" | "DEVELOPMENT" | "DOCKER";
    diContainer: IDIContainer;
}) {
    const app = express();
    app.options("*", cors());
    app.use(cors());

    app.use(express.urlencoded({ extended: false }));
    config.middleware.forEach((middleware) => {
        app.use(middleware);
    });

    const upload = multer({ storage: multer.memoryStorage() });
    app.post("/upload", upload.array("file"), (req, res) => {
        // Files
        const files = req.files as Express.Multer.File[] | null;
        if (files == null || files.length === 0) {
            res.status(StatusCodes.BAD_REQUEST).json(ApiErrorFactory.createSingleErrorList({ message: "Must upload at least 1 file.", path: "_", code: API_ERROR_CODES.VALIDATION_ERROR }));
            return;
        }

        if (files.length > 8) {
            res.status(StatusCodes.BAD_REQUEST).json(ApiErrorFactory.createSingleErrorList({ message: "Cannot upload more than 8 files.", path: "_", code: API_ERROR_CODES.VALIDATION_ERROR }));
            return;
        }

        // File Formats
        const mimeTypeErrors: IApiError[] = [];
        files.forEach((file) => {
            if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
                mimeTypeErrors.push({ message: `${file.originalname}: Can only upload .jpeg and .png files.`, path: file.originalname, code: API_ERROR_CODES.VALIDATION_ERROR });
            }
        });

        if (mimeTypeErrors.length > 0) {
            res.status(StatusCodes.UNSUPPORTED_MEDIA_TYPE).json(mimeTypeErrors);
            return;
        }

        // File Size
        const payloadLengthErrors: IApiError[] = [];
        files.forEach((file) => {
            if (file.size > 8_388_608) {
                payloadLengthErrors.push({ message: `${file.originalname}: Image size cannot be larger than 8MB.`, path: file.originalname, code: API_ERROR_CODES.VALIDATION_ERROR });
            }
        });

        if (payloadLengthErrors.length > 0) {
            res.status(StatusCodes.REQUEST_TOO_LONG).json(payloadLengthErrors);
            return;
        }

        // Save Images
        const response: UploadImagesResponseDTO = { images: [] };

        files.forEach((file) => {
            const generatedFilename = crypto.randomUUID();
            const extension = path.extname(file.originalname);
            const url = generatedFilename + extension;

            const uploadPath = path.join(MEDIA_ROOT, url);
            try {
                writeFileSync(uploadPath, file.buffer);
            } catch (e) {
                throw e;
            }

            response.images.push({ url: `${req.protocol}://` + path.join(`${req.hostname}:${req.socket.localPort}`.toString(), MEDIA_FOLDER_NAME, url) });
        });

        res.json(response);
    });

    app.use("/media", express.static("media"));
    app.use("/static", express.static("static"));
    app.use(errorLogger);

    app.use(express.static(STATIC_DIR));

    return app;
}
