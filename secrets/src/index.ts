import dotenv from "dotenv";
import createFileServer from "api/createSecretsServer";
import generateCert from "api/generateCert";
import responseLogger from "api/middleware/responseLogger";
import { ProductionDIContainer } from "api/services/DIContainer";
import { assert, literal, union } from "superstruct";
import fs from "fs";
import path from "path";
import https from "https";
import { CERT_DIR, DIST_DIR } from "config";

dotenv.config({ path: path.join(DIST_DIR, `.env.${process.env.NODE_ENV}`) });

export const SECRETS = {
    AUTH_SERVER_URL: process.env.AUTH_SERVER_URL,
    API_URL: process.env.API_URL,
    FILE_SERVER_URL: process.env.FILE_SERVER_URL,
    KAFKA_ADDRESS: process.env.KAFKA_ADDRESS,
    RABBIT_ADDRESS: process.env.RABBIT_ADDRESS,
}

console.log(SECRETS)

if (global.crypto == null) {
    global.crypto = require("crypto");
}

async function main() {
    // Get environment file
    const environment = process.env.NODE_ENV;
    console.log(environment);

    const environmentValidator = union([literal("DEVELOPMENT"), literal("PRODUCTION"), literal("DOCKER"), literal("DOCKER-DEV")]);
    assert(environment, environmentValidator);
    require("dotenv").config({
        path: `${process.cwd()}/.env.${environment}`,
    });

    const port = process.env.PORT == null ? null : parseInt(process.env.PORT);
    const portValidator = union([literal(3443)]);
    assert(port, portValidator);

    const host = process.env.HOST;
    const hostValidator = union([literal("127.0.0.1"), literal("0.0.0.0")]);
    assert(host, hostValidator);

    const publicHost = process.env.PUBLIC_HOST;
    const publicHostValidator = union([literal("127.0.0.1"), literal("secrets")]);
    assert(publicHost, publicHostValidator);

    const diContainer = new ProductionDIContainer();

    generateCert({ nodeEnv: environment, host: publicHost });
    const privateKey = fs.readFileSync(path.join(CERT_DIR, "private-key.pem"), "utf8");
    const certificate = fs.readFileSync(path.join(CERT_DIR, "certificate.pem"), "utf8");

    const app = createFileServer({
        middleware: [responseLogger],
        diContainer: diContainer,
    });

    const httpsServer = https.createServer({ key: privateKey, cert: certificate }, app);

    httpsServer.listen(port, host, () => {
        console.log(`Server running at https://${host}:${port}/`);
    });
}

try {
    main();
} catch (err: any) {
    process.exit();
}
