import IJwtTokenGateway from "api/interfaces/IJwtTokenGateway";
import ITokenRepository from "application/interfaces/ITokenRepository";
import IAuthDataAccess from "infrastructure/interfaces/IAuthDataAccess";

export function createAuthDataAccessMock(): jest.Mocked<IAuthDataAccess> {
    return {
        logout: jest.fn(),
        validateToken: jest.fn(),
    };
}

export function createTokenRepositoryMock(): jest.Mocked<ITokenRepository> {
    return {
        getToken: jest.fn(),
        expireToken: jest.fn(),
        create: jest.fn(),
    };
}

export function createJwtTokenGatewayMock(): jest.Mocked<IJwtTokenGateway> {
    return {
        readCached: jest.fn(),
        readRemote: jest.fn(),
        create: jest.fn(),
    };
}
