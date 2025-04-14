import { RedisClientConnection } from "api/createApplication";
import ITokenRepository from "api/interfaces/ITokenRepository";
import JwtToken from "domain/entities/JwtToken";
import IJwtTokenSchema from "infrastructure/schemas/IJwtTokenSchema";

class RedisTokenRepository implements ITokenRepository {
    constructor(private readonly redis: RedisClientConnection) {}

    async getToken(value: string): Promise<JwtToken | null> {
        const storedValue = await this.redis.get(value);
        if (storedValue == null) {
            return null;
        }

        const row: IJwtTokenSchema = JSON.parse(storedValue);
        return JwtToken.executeCreate({ value: row.value, expiryDate: new Date(row.expiryDate), userId: row.userId });
    }

    async expireToken(token: JwtToken): Promise<void> {
        await this.redis.del(token.value);
    }

    async create(token: JwtToken): Promise<void> {
        const EX = Math.floor((token.expiryDate.getTime() - Date.now()) / 1000);

        const row: IJwtTokenSchema = { expiryDate: token.expiryDate.toUTCString(), userId: token.userId, value: token.value };
        await this.redis.set(token.value, JSON.stringify(row), {
            EX: EX,
        });
    }
}

export default RedisTokenRepository;
