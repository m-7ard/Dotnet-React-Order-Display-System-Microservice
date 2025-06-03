import createProxyServer from "api/createProxyServer";
import responseLogger from "api/middleware/responseLogger";
import { ProductionDIContainer } from "api/services/DIContainer";
import { Kafka } from "kafkajs";
import { createClient } from "redis";
import { assert, literal, union } from "superstruct";
import amqp from "amqplib";
import LocalSecretDataAccess from "infrastructure/dataAccess/LocalSecretDataAccess";
import secretsKeys from "infrastructure/values/secretKeys";
import fetchWithRetry from "api/utils/fetchWithRetry";
import { Agent } from "https";

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

    // Port
    const port = process.env.PORT == null ? null : parseInt(process.env.PORT);
    const portValidator = union([literal(4200), literal(3100)]);
    assert(port, portValidator);

    // Host
    const host = process.env.HOST;
    const hostValidator = union([literal("127.0.0.1"), literal("0.0.0.0")]);
    assert(host, hostValidator);

    // Secret Server
    const secretServerUrl = process.env.SECRET_SERVER_URL;
    const secretServerUrlValidator = union([literal("https://127.0.0.1:3443"), literal("https://secrets:3443")]);
    assert(secretServerUrl, secretServerUrlValidator);

    const insecureAgent = new Agent({
        rejectUnauthorized: false, // Only for the local self-signed cert. remove with real CA
    });
    const localSecretDataAccess = new LocalSecretDataAccess(secretServerUrl, insecureAgent);
    await fetchWithRetry(`${secretServerUrl}/health`, {
        agent: insecureAgent,
    });

    // File Server
    const fileServerUrl = await localSecretDataAccess.getKeyValue(secretsKeys.FILE_SERVER_URL);
    const fileServerUrlValidator = union([literal("http://127.0.0.1:4300"), literal("http://127.0.0.1:3000"), literal("http://file:3000")]);
    assert(fileServerUrl, fileServerUrlValidator);

    // Auth Server
    const authServerUrl = await localSecretDataAccess.getKeyValue(secretsKeys.AUTH_SERVER_URL);
    const authServerUrlValidator = union([literal("http://127.0.0.1:8000"), literal("http://auth:8000")]);
    assert(authServerUrl, authServerUrlValidator);

    // Main Api Server
    const mainApiServerUrl = await localSecretDataAccess.getKeyValue(secretsKeys.API_URL);
    const mainApiServerUrlValidator = union([literal("http://localhost:5102"), literal("http://web:5000")]);
    assert(mainApiServerUrl, mainApiServerUrlValidator);

    // Kafka
    const kafkaAddress = await localSecretDataAccess.getKeyValue(secretsKeys.KAFKA_ADDRESS);
    const kafkaAddressValidator = union([literal("localhost:29092"), literal("kafka:29092")]);
    assert(kafkaAddress, kafkaAddressValidator);

    // Rabbit
    const rabbitAddress = await localSecretDataAccess.getKeyValue(secretsKeys.RABBIT_ADDRESS);
    const rabbitAddressValidator = union([literal("amqp://guest:guest@localhost:5672"), literal("amqp://guest:guest@rabbitmq:5672")]);
    assert(rabbitAddress, rabbitAddressValidator);

    const diContainer = new ProductionDIContainer();
    const kafka = new Kafka({
        clientId: "my-producer",
        brokers: [kafkaAddress],
    });

    const redis = createClient({ url: environment === "DOCKER" ? "redis://redis:6379" : undefined });
    await redis.connect();
    await redis.flushDb();

    // TODO: make a data access to get the addresses

    const rabbit = await amqp.connect(rabbitAddress);
    const channel = await rabbit.createChannel();
    await channel.assertQueue("apiQueue", { durable: true });

    const app = createProxyServer({
        middleware: [responseLogger],
        diContainer: diContainer,
        redis: redis,
        fileServerUrl: fileServerUrl,
        authServerUrl: authServerUrl,
        mainAppServerUrl: mainApiServerUrl,
        kafka: kafka,
        websocketServerHost: host,
        channel: channel,
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
