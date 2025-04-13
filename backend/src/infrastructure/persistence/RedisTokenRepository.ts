import { RedisClientConnection } from "api/createApplication";
import ITokenRepository from "api/interfaces/ITokenRepository";
import JwtToken from "domain/entities/JwtToken";

class RedisTokenRepository implements ITokenRepository {
    constructor(private readonly redis: RedisClientConnection) {}

    async getToken(value: string): Promise<JwtToken | null> {
        const expirationDate = await this.redis.get(value);
        if (expirationDate == null) {
            return null;
        }

        return JwtToken.executeCreate({ value: value, expiryDate: new Date(expirationDate) });
        
    }

    async expireToken(token: JwtToken): Promise<void> {
        await this.redis.del(token.value);
    }

    async create(token: JwtToken): Promise<void> {
        const EX = Math.floor((token.expiryDate.getTime() - Date.now()) / 1000);
        await this.redis.set(token.value, token.expiryDate.toUTCString(), {
            EX: EX
        });
    }
}

export default RedisTokenRepository;