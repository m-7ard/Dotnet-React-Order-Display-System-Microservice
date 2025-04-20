import ITokenRepository from "application/interfaces/ITokenRepository";
import JwtToken from "domain/entities/JwtToken";
import UnitTestMixin from "../../../__utils__/UnitTestMixin";
import { createTokenRepositoryMock } from "../../../__mocks__/mocks";
import CreateTokenCommandHandler, { CreateTokenCommand } from "application/handlers/auth/CreateTokenCommandHandler";

let DEFAULT_COMMAND: CreateTokenCommand;
let MOCK_TOKEN: JwtToken;
let mockTokenRepo: jest.Mocked<ITokenRepository>;
let handler: CreateTokenCommandHandler;

beforeAll(() => {});

afterAll(() => {});

beforeEach(() => {
    MOCK_TOKEN = UnitTestMixin.createJwtToken(1);
    DEFAULT_COMMAND = new CreateTokenCommand({
        bearerToken: MOCK_TOKEN.value,
        expiryDate: MOCK_TOKEN.expiryDate,
        userId: MOCK_TOKEN.userId
    });


    mockTokenRepo = createTokenRepositoryMock();

    handler = new CreateTokenCommandHandler(mockTokenRepo);
});

describe("CreateTokenCommandHandlerUnitTest", () => {
    it("CreateTokenCommandHandlerUnitTest; Valid Data; Success;", async () => {
        // Setup

        // Act
        const response = await handler.handle(DEFAULT_COMMAND);

        // Assert
        expect(response.isOk());
        expect(mockTokenRepo.create).toHaveBeenCalledTimes(1);
    });
});
