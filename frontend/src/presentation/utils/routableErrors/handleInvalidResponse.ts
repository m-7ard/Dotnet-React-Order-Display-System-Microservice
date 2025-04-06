import RoutableException from "../../routableException/RoutableException";
import InternalServerErrorException from "../../routableException/InternalServerErrorException";
import IPlainApiError from "../../../infrastructure/interfaces/IPlainApiError";
import NotFoundException from "../../routableException/NotFoundException";
import UnkownErrorException from "../../routableException/UnkownErrorException";
import ClientSideErrorException from "../../routableException/ClientSideErrorException";


async function tryGetError(response: Response) {
    try {
        const errors: IPlainApiError[] = await response.json();
        const errorMessage = errors.map(({ message }) => message).join("\n");
        return errorMessage;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
        return response.statusText;
    }
}

export default async function handleInvalidResponse(response: Response): Promise<RoutableException> {
    try {
        const errorMessage = await tryGetError(response);

        if (response.status === 500) {
            console.log(errorMessage)
            throw new InternalServerErrorException(errorMessage);
        }

        if (response.status === 404) {
            console.log("-------> ", errorMessage)
            throw new NotFoundException(errorMessage);
        }

        throw new UnkownErrorException(errorMessage);
    } catch (error: unknown) {
        if (error instanceof RoutableException) {
            return error;
        }

        if (error instanceof Error) {
            return new ClientSideErrorException(error.message);
        }

        return new ClientSideErrorException(JSON.stringify(error));
    }
}
