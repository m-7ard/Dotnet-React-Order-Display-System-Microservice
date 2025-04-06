import { Result } from "neverthrow";
import { useApplicationExceptionContext } from "../Application/Application.ExceptionProvider.Context";
import { useCallback } from "react";
import tryHandleRequest from "../utils/routableErrors/tryHandleRequest";
import handleInvalidResponse from "../utils/routableErrors/handleInvalidResponse";

export default function useResponseHandler() {
    const { dispatchException } = useApplicationExceptionContext();

    return useCallback(
        async <SuccessType, ErrorType, FallbackType>(props: {
            requestFn: () => Promise<Response>;
            onResponseFn: (response: Response) => Promise<Result<SuccessType, ErrorType>>;
            fallbackValue?: FallbackType;
        }) => {
            const { requestFn, onResponseFn, fallbackValue } = props;

            try {
                const responseResult = await tryHandleRequest(requestFn());
                if (responseResult.isErr()) {
                    dispatchException(responseResult.error);
                    return fallbackValue;
                }

                const response = responseResult.value;
                const result = await onResponseFn(response);
                if (result.isOk()) {
                    return result.value;
                }

                const error = await handleInvalidResponse(response);
                console.log(error)
                dispatchException(error);
                return result.error;
            } catch (err: unknown) {
                dispatchException(err);
                return fallbackValue;
            }
        },
        [dispatchException],
    );
}
