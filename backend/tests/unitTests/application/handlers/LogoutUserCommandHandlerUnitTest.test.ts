import ITokenRepository from "application/interfaces/ITokenRepository";
import IAuthDataAccess from "infrastructure/interfaces/IAuthDataAccess";
import { createAuthDataAccessMock, createTokenRepositoryMock } from "../../../__mocks__/mocks";
import JwtToken from "domain/entities/JwtToken";
import LogoutUserCommandHandler, { LogoutUserCommand } from "application/handlers/auth/LogoutUserCommandHandler";
import RegularUserLogoutFailedError from "application/errors/auth/logout/RegularUserLogoutFailedError";
import UnexpectedUserLogoutFailedError from "application/errors/auth/logout/UnexpectedUserLogoutFailedError";

let DEFAULT_COMMAND: LogoutUserCommand;
let MOCK_TOKEN: JwtToken;
let mockAuthDataAccess: jest.Mocked<IAuthDataAccess>;
let mockTokenRepo: jest.Mocked<ITokenRepository>;
let handler: LogoutUserCommandHandler;

beforeAll(() => {});

afterAll(() => {});

beforeEach(() => {
    DEFAULT_COMMAND = new LogoutUserCommand({
        bearerToken: "bearer",
        refreshToken: "refresh",
    });
    MOCK_TOKEN = JwtToken.executeCreate({ expiryDate: new Date(), userId: "1", value: "1" })

    mockAuthDataAccess = createAuthDataAccessMock();
    mockTokenRepo = createTokenRepositoryMock();

    handler = new LogoutUserCommandHandler(mockAuthDataAccess, mockTokenRepo);
});

describe("LogoutUserCommandHandlerUnitTest", () => {
    it("LogoutUserCommandHandlerUnitTest; Valid Data (Token Is Cached); Success;", async () => {
        // Setup
        mockAuthDataAccess.logout.mockImplementationOnce(async () => new Response(null, { status: 200 }));
        mockTokenRepo.getToken.mockImplementationOnce(async () => MOCK_TOKEN);

        // Act
        const response = await handler.handle(DEFAULT_COMMAND);

        // Assert
        expect(response.isOk());
        expect(mockTokenRepo.expireToken.mock.calls[0][0]).toBe(MOCK_TOKEN);
    });

    it("LogoutUserCommandHandlerUnitTest; Valid Data (Token Is Not Cached); Success;", async () => {
        // Setup
        mockAuthDataAccess.logout.mockImplementationOnce(async () => new Response(null, { status: 200 }));

        // Act
        const response = await handler.handle(DEFAULT_COMMAND);

        // Assert
        expect(response.isOk());
        expect(mockTokenRepo.expireToken).toHaveBeenCalledTimes(0);
    });

    it("LogoutUserCommandHandlerUnitTest; 4XX Auth Failure; Failure;", async () => {
        // Setup
        mockAuthDataAccess.logout.mockImplementationOnce(async () => new Response(null, { status: 400 }));

        // Act
        const response = await handler.handle(DEFAULT_COMMAND);

        // Assert
        expect(response.isErr() && response.error instanceof RegularUserLogoutFailedError);
    });

    it("LogoutUserCommandHandlerUnitTest; 5XX Auth Failure; Failure;", async () => {
        // Setup
        mockAuthDataAccess.logout.mockImplementationOnce(async () => new Response(null, { status: 500 }));

        // Act
        const response = await handler.handle(DEFAULT_COMMAND);

        // Assert
        expect(response.isErr() && response.error instanceof UnexpectedUserLogoutFailedError);
    });
});
