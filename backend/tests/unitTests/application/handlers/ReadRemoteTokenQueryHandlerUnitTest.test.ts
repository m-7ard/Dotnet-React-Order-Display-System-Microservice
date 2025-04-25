import { createAuthDataAccessMock } from "../../../__mocks__/mocks";
import ReadRemoteTokenQueryHandler, { ReadRemoteTokenQuery } from "application/handlers/auth/ReadRemoteTokenQueryHandler";
import IAuthDataAccess from "infrastructure/interfaces/IAuthDataAccess";
import ValidateTokenResponseDTO from "infrastructure/contracts/auth/validateToken/ValidateTokenResponseDTO";

let DEFAULT_COMMAND: ReadRemoteTokenQuery;
let mockAuthDataAccess: jest.Mocked<IAuthDataAccess>;
let handler: ReadRemoteTokenQueryHandler;

beforeAll(() => {});

afterAll(() => {});

beforeEach(() => {
    DEFAULT_COMMAND = new ReadRemoteTokenQuery({
        bearerToken: "bearer",
    });

    mockAuthDataAccess = createAuthDataAccessMock();
    handler = new ReadRemoteTokenQueryHandler(mockAuthDataAccess);
});

describe("ReadRemoteTokenQueryHandlerUnitTest", () => {
    it("ReadRemoteTokenQueryHandlerUnitTest; Token Exists; Success;", async () => {
        // Setup
        const data: ValidateTokenResponseDTO = { expiration: new Date().toISOString(), user_id: "1"  };
        mockAuthDataAccess.validateToken.mockImplementationOnce(async () => new Response(JSON.stringify(data), { status: 200 }));

        // Act
        const response = await handler.handle(DEFAULT_COMMAND);

        // Assert
        expect(response.isOk() && response.value?.userId === data.user_id);
    });

    it("ReadRemoteTokenQueryHandlerUnitTest; Token Does Not Exist; Success;", async () => {
        // Setup
        mockAuthDataAccess.validateToken.mockImplementationOnce(async () => new Response(null, { status: 400 }));

        // Act
        const response = await handler.handle(DEFAULT_COMMAND);

        // Assert
        expect(response.isOk() && response.value === null);
    });

    it("ReadRemoteTokenQueryHandlerUnitTest; Invalid Request; Success;", async () => {
        // Setup
        mockAuthDataAccess.validateToken.mockImplementationOnce(async () => new Response(null, { status: 500 }));

        // Act
        const response = await handler.handle(DEFAULT_COMMAND);

        // Assert
        expect(response.isErr());
    });
});
