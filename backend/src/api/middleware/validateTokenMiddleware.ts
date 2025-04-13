import ITokenRepository from "api/interfaces/ITokenRepository";
import JwtToken from "domain/entities/JwtToken";
import { NextFunction, Request, Response } from "express";
import ValidateTokenResponseDTO from "infrastructure/contracts/auth/validateToken/ValidateTokenResponseDTO";
import IAuthDataAccess from "infrastructure/interfaces/IAuthDataAccess";

export function validateTokenMiddlewareFactory(props: { tokenRepository: ITokenRepository; authDataAccess: IAuthDataAccess; }) {
    async function validateTokenMiddleware(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        if (authHeader == null) {
            res.status(401).send();
            return;
        }
    
        const [_, token] = authHeader.split(" ");
        if (token == null) {
            res.status(401).send();
            return;
        }
        
        const tokenDomain = await tokenRepository.getToken(token)
        if (tokenDomain != null) {
            if (tokenDomain.isValid()) {
                next();
                return;
            } else {
                await tokenRepository.expireToken(tokenDomain);
            }
        }
    
        const response = await authDataAccess.validateToken(token);
    
        if (response.ok) {
            const data: ValidateTokenResponseDTO = await response.json();
            
            const tokenDomain = JwtToken.executeCreate({ expiryDate: new Date(data.expiration), value: token });
            await tokenRepository.create(tokenDomain);
    
            next();
            return;
        }
    
        res.status(401).send();
    }

    const { tokenRepository, authDataAccess } = props;

    return validateTokenMiddleware;
}
