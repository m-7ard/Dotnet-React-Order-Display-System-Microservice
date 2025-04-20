import createProxyServer from "api/createProxyServer";
import responseLogger from "api/middleware/responseLogger";
import { ProductionDIContainer } from "api/services/DIContainer";
import { createClient } from "redis";
import { assert, literal, union } from "superstruct";

if (global.crypto == null) {
    global.crypto = require('crypto');
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

    const diContainer = new ProductionDIContainer();


    const redis = createClient({ url: environment === "DOCKER" ? 'redis://redis:6379' : undefined });
    await redis.connect();
    await redis.flushDb();

    const app = createProxyServer({
        port: port,
        middleware: [responseLogger],
        mode: environment,
        diContainer: diContainer,
        redis: redis
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
