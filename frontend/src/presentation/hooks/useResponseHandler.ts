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
        }): Promise<FallbackType extends undefined ? SuccessType | ErrorType | undefined : SuccessType | ErrorType | FallbackType> => {
            const { requestFn, onResponseFn, fallbackValue } = props;

            try {
                const responseResult = await tryHandleRequest(requestFn());
                if (responseResult.isErr()) {
                    dispatchException(responseResult.error);
                    return fallbackValue as never;
                }

                const response = responseResult.value;
                const result = await onResponseFn(response);
                if (result.isOk()) {
                    return result.value as never;
                }

                const error = await handleInvalidResponse(response);
                console.log(error);
                dispatchException(error);
                return result.error as never;
            } catch (err: unknown) {
                dispatchException(err);
                return fallbackValue as never;
            }
        },
        [dispatchException],
    );
}

type RequestFn = () => Promise<Response>;

export function useFluentResponseHandler() {
    const { dispatchException } = useApplicationExceptionContext();

    class ResponseHandlerBuilder<SuccessType, ErrorType, FallbackType = undefined> {
        private requestFn?: RequestFn;
        private onResponseFn?: (res: Response) => Promise<Result<SuccessType, ErrorType>>;
        private fallbackValue?: FallbackType;

        withRequest(fn: RequestFn) {
            this.requestFn = fn;
            return this;
        }

        onResponse(fn: (res: Response) => Promise<Result<SuccessType, ErrorType>>) {
            this.onResponseFn = fn;
            return this;
        }

        withFallback<T>(fallback: T): ResponseHandlerBuilder<SuccessType, ErrorType, T> {
            this.fallbackValue = fallback;
            return this as any;
        }

        async execute(): Promise<FallbackType extends undefined ? SuccessType | ErrorType | undefined : SuccessType | ErrorType | FallbackType> {
            try {
                const responseResult = await tryHandleRequest(this.requestFn!());
                if (responseResult.isErr()) {
                    dispatchException(responseResult.error);
                    return this.fallbackValue as any;
                }

                const response = responseResult.value;
                const result = await this.onResponseFn!(response);

                if (result.isOk()) {
                    return result.value;
                }

                const error = await handleInvalidResponse(response);
                dispatchException(error);
                return result.error;
            } catch (err) {
                dispatchException(err);
                return this.fallbackValue as any;
            }
        }
    }

    return function responseHandler<SuccessType, ErrorType>() {
        return new ResponseHandlerBuilder<SuccessType, ErrorType>();
    };
}
