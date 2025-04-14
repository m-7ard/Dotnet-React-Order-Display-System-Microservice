import JwtToken from "domain/entities/JwtToken";

interface ITokenRepository {
    getToken(value: string): Promise<JwtToken | null>;
    expireToken(token: JwtToken): Promise<void>;
    create(token: JwtToken): Promise<void>
}

export default ITokenRepository;