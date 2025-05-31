const secretsKeys = {
    AUTH_SERVER_URL: "AUTH_SERVER_URL",
    API_URL: "API_URL",
    FILE_SERVER_URL: "FILE_SERVER_URL",
    KAFKA_ADDRESS: "KAFKA_ADDRESS",
    RABBIT_ADDRESS: "RABBIT_ADDRESS",
} as const;

export type TSecretKey = keyof typeof secretsKeys;

export default secretsKeys;
