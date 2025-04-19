import ITokenRepository from "application/interfaces/ITokenRepository";
import JwtToken from "domain/entities/JwtToken";
import ReadCachedTokenQueryHandler, { ReadCachedTokenQuery } from "application/handlers/auth/ReadCachedTokenQueryHandler";
import UnitTestMixin from "../../../__utils__/UnitTestMixin";
import { createTokenRepositoryMock } from "../../../__mocks__/mocks";
import { DateTime } from "luxon";

let DEFAULT_COMMAND: ReadCachedTokenQuery;
let MOCK_TOKEN: JwtToken;
let mockTokenRepo: jest.Mocked<ITokenRepository>;
let handler: ReadCachedTokenQueryHandler;

beforeAll(() => {});

afterAll(() => {});

beforeEach(() => {
    DEFAULT_COMMAND = new ReadCachedTokenQuery({
        bearerToken: "bearer",
    });
    MOCK_TOKEN = UnitTestMixin.createJwtToken(1);

    mockTokenRepo = createTokenRepositoryMock();

    handler = new ReadCachedTokenQueryHandler(mockTokenRepo);
});

describe("ReadCachedTokenQueryHandlerUnitTest", () => {
    it("ReadCachedTokenQueryHandlerUnitTest; Token Exists; Success;", async () => {
        // Setup
        mockTokenRepo.getToken.mockImplementationOnce(async () => MOCK_TOKEN);

        // Act
        const response = await handler.handle(DEFAULT_COMMAND);

        // Assert
        expect(response.isOk() && response.value === MOCK_TOKEN);
    });

    it("ReadCachedTokenQueryHandlerUnitTest; Token Does Not Exist; Success;", async () => {
        // Setup
        mockTokenRepo.getToken.mockImplementationOnce(async () => null);

        // Act
        const response = await handler.handle(DEFAULT_COMMAND);

        // Assert
        expect(response.isOk() && response.value === null);
    });

    it("ReadCachedTokenQueryHandlerUnitTest; Expired Token; Success;", async () => {
        // Setup
        MOCK_TOKEN.expiryDate = DateTime.now().minus({ years: 1000 }).toJSDate();
        mockTokenRepo.getToken.mockImplementationOnce(async () => MOCK_TOKEN);

        // Act
        const response = await handler.handle(DEFAULT_COMMAND);

        // Assert
        expect(response.isOk() && response.value === null);
    });
});
