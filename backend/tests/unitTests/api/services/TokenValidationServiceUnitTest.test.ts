import ITokenRepository from "application/interfaces/ITokenRepository";
import JwtToken from "domain/entities/JwtToken";
import UnitTestMixin from "../../../__utils__/UnitTestMixin";
import { createJwtTokenGatewayMock } from "../../../__mocks__/mocks";
import { CreateTokenCommand } from "application/handlers/auth/CreateTokenCommandHandler";
import { TokenValidationErrorCode, TokenValidationService } from "api/services/TokenValidationService";
import IJwtTokenGateway from "api/interfaces/IJwtTokenGateway";
import { err, ok } from "neverthrow";

let DEFAULT_COMMAND: CreateTokenCommand;
let MOCK_TOKEN: JwtToken;
let VALID_HEADER: string;
let mockTokenRepo: jest.Mocked<ITokenRepository>;
let service: TokenValidationService;
let mockGateway: jest.Mocked<IJwtTokenGateway>;

beforeAll(() => {});

afterAll(() => {});

beforeEach(() => {
    MOCK_TOKEN = UnitTestMixin.createJwtToken(1);
    VALID_HEADER = "Bearer valid_token";
    DEFAULT_COMMAND = new CreateTokenCommand({
        bearerToken: MOCK_TOKEN.value,
        expiryDate: MOCK_TOKEN.expiryDate,
        userId: MOCK_TOKEN.userId,
    });

    mockGateway = createJwtTokenGatewayMock();
    service = new TokenValidationService(mockGateway);
});

describe("TokenValidationService", () => {
    it("TokenValidationService; Token Is Cached; Success;", async () => {
        // Setup
        mockGateway.readCached.mockImplementationOnce(async () => ok(MOCK_TOKEN));

        // Act
        const response = await service.validate(VALID_HEADER);

        // Assert
        expect(response.isOk() && response.value === MOCK_TOKEN);
    });

    it("TokenValidationService; Token Exists Remotely; Success;", async () => {
        // Setup
        mockGateway.readCached.mockImplementationOnce(async () => ok(null));
        mockGateway.readRemote.mockImplementationOnce(async () => ok(MOCK_TOKEN));
        mockGateway.create.mockImplementationOnce(async () => ok(undefined));

        // Act
        const response = await service.validate(VALID_HEADER);

        // Assert
        expect(response.isOk() && response.value === MOCK_TOKEN);
        expect(mockGateway.readRemote).toHaveBeenCalled();
        expect(mockGateway.create).toHaveBeenCalled();
    });

    it("TokenValidationService; Missing Header; Failure;", async () => {
        // Setup

        // Act
        const response = await service.validate(undefined);

        // Assert
        expect(response.isErr() && response.error === TokenValidationErrorCode.MISSING_AUTH_HEADER);
    });

    it("TokenValidationService; Invalid Header; Failure;", async () => {
        // Setup

        // Act
        const response = await service.validate("invalidHeader");

        // Assert
        expect(response.isErr() && response.error === TokenValidationErrorCode.INVALID_AUTH_HEADER);
    });

    it("TokenValidationService; Unexpected Error From Cached Lookup; Failure;", async () => {
        // Setup
        mockGateway.readCached.mockImplementationOnce(async () => err([]));

        // Act
        const response = await service.validate(VALID_HEADER);

        // Assert
        expect(response.isErr() && response.error === TokenValidationErrorCode.TOKEN_LOOKUP_FAILED);
    });

    it("TokenValidationService; Unexpected Error From Remote Lookup; Failure;", async () => {
        // Setup
        mockGateway.readCached.mockImplementationOnce(async () => ok(null));
        mockGateway.readRemote.mockImplementationOnce(async () => err([]));

        // Act
        const response = await service.validate(VALID_HEADER);

        // Assert
        expect(response.isErr() && response.error === TokenValidationErrorCode.TOKEN_LOOKUP_FAILED);
        expect(mockGateway.readRemote).toHaveBeenCalled();
    });

    it("TokenValidationService; Remote Token Does Not Exist; Failure;", async () => {
        // Setup
        mockGateway.readCached.mockImplementationOnce(async () => ok(null));
        mockGateway.readRemote.mockImplementationOnce(async () => ok(null));

        // Act
        const response = await service.validate(VALID_HEADER);

        // Assert
        expect(response.isErr() && response.error === TokenValidationErrorCode.INVALID_TOKEN);
    });

    it("TokenValidationService; Cannot Create Token; Failure;", async () => {
        // Setup
        mockGateway.readCached.mockImplementationOnce(async () => ok(null));
        mockGateway.readRemote.mockImplementationOnce(async () => ok(MOCK_TOKEN));
        mockGateway.create.mockImplementationOnce(async () => err([]));

        // Act
        const response = await service.validate(VALID_HEADER);

        // Assert
        expect(response.isErr() && response.error === TokenValidationErrorCode.TOKEN_CREATION_FAILED);
    });
});
