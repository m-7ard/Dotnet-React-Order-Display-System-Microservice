import createProxyServer from "api/createProxyServer";
import responseLogger from "api/middleware/responseLogger";
import { ProductionDIContainer } from "api/services/DIContainer";
import { Kafka } from "kafkajs";
import { createClient } from "redis";
import { assert, literal, union } from "superstruct";

if (global.crypto == null) {
    global.crypto = require("crypto");
}

async function main() {
    // Get environment file
    const environment = process.env.NODE_ENV;
    console.log(environment);
    const environmentValidator = union([literal("DEVELOPMENT"), literal("PRODUCTION"), literal("DOCKER")]);
    assert(environment, environmentValidator);
    require("dotenv").config({
        path: `${process.cwd()}/.env.${environment}`,
    });

    const port = process.env.PORT == null ? null : parseInt(process.env.PORT);
    const portValidator = union([literal(4200), literal(3100)]);
    assert(port, portValidator);

    const host = process.env.HOST;
    const hostValidator = union([literal("127.0.0.1"), literal("0.0.0.0")]);
    assert(host, hostValidator);

    const fileServerUrl = process.env.FILE_SERVER_URL;
    const fileServerUrlValidator = union([literal("http://127.0.0.1:4300"), literal("http://127.0.0.1:3000"), literal("http://file:3000")]);
    assert(fileServerUrl, fileServerUrlValidator);

    const authServerUrl = process.env.AUTH_URL;
    const authServerUrlValidator = union([literal("http://127.0.0.1:8000"), literal("http://auth:8000")]);
    assert(authServerUrl, authServerUrlValidator);

    const mainApiServerUrl = process.env.API_URL;
    const mainApiServerUrlValidator = union([literal("http://localhost:5102"), literal("http://web:5000")]);
    assert(mainApiServerUrl, mainApiServerUrlValidator);

    const diContainer = new ProductionDIContainer();
    const kafka = new Kafka({
        clientId: "my-producer",
        brokers: ["localhost:29092"],
    });

    const redis = createClient({ url: environment === "DOCKER" ? "redis://redis:6379" : undefined });
    await redis.connect();
    await redis.flushDb();

    const app = createProxyServer({
        middleware: [responseLogger],
        diContainer: diContainer,
        redis: redis,
        fileServerUrl: fileServerUrl,
        authServerUrl: authServerUrl,
        mainAppServerUrl: mainApiServerUrl,
        kafka: kafka
    });

    const server = app.listen(port, host, () => {
        console.log(`Server running at http://${host}:${port}/`);
    });
}

try {
    main();
} catch (err: any) {
    process.exit();
}
