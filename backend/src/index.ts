import createApplication from "api/createApplication";
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
    const portValidator = union([literal(4200), literal(3000)]);
    assert(port, portValidator);

    const host = process.env.HOST;
    const hostValidator = union([literal("127.0.0.1"), literal("0.0.0.0")]);
    assert(host, hostValidator);

    const diContainer = new ProductionDIContainer();
    const authUrl = process.env.AUTH_URL;
    if (authUrl == null) {
        throw new Error("Auth Url was not configured.");
    }

    const redis = createClient();
    await redis.connect();

    const app = createApplication({
        port: port,
        middleware: [responseLogger],
        mode: environment,
        diContainer: diContainer,
        redis: redis,
        authUrl: authUrl
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
