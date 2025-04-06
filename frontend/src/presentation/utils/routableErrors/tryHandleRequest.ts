import LoaderErrorException from "../../routableException/LoaderErrorException";
import { err, ok, Result } from "neverthrow";
import RoutableException from "../../routableException/RoutableException";
import UnkownErrorException from "../../routableException/UnkownErrorException";

export default async function tryHandleRequest(promise: Promise<Response>): Promise<Result<Response, RoutableException>> {
    try {
        try {
            const response = await promise;
            return ok(response);
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw new LoaderErrorException(err.message);
            } else {
                throw err;
            }
        }
    } catch (error: unknown) {
        if (error instanceof LoaderErrorException) {
            return err(error);
        }

        if (error instanceof Error) {
            return err(new UnkownErrorException(error.message));
        }

        return err(new UnkownErrorException(JSON.stringify(error)));
    }
}
