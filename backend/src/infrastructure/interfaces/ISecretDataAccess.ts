import { TSecretKey } from "infrastructure/values/secretKeys";

interface ISecretDataAccess {
    getKeyValue(key: TSecretKey): Promise<string>;
}

export default ISecretDataAccess;
