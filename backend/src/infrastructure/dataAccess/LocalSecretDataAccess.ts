import ISecretDataAccess from "infrastructure/interfaces/ISecretDataAccess";
import { TSecretKey } from "infrastructure/values/secretKeys";
import fetch from "node-fetch";
import { Agent } from "https";
import ReadSecretResponseDTO from "infrastructure/contracts/secrets/ReadSecretResponseDTO";

class LocalSecretDataAccess implements ISecretDataAccess {
    constructor(private readonly secretsServerUrl: string, private readonly agent?: Agent) {}

    async getKeyValue(key: TSecretKey): Promise<string> {
        const response = await fetch(`${this.secretsServerUrl}/secrets/${key}`, {
            agent: this.agent
        });

        if (response.status === 404) {
            throw new Error(`No secret of key "${key}" exists.`);
        }

        if (!response.ok) {
            throw new Error(`Something went wrong while trying to fetch secret.`);
        }
        
        const dto = await response.json() as ReadSecretResponseDTO;
        return dto.value;
    }
}

export default LocalSecretDataAccess;
