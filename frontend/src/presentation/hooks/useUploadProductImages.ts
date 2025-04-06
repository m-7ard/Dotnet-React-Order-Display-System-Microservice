import { ok, err } from "neverthrow";
import { useCallback } from "react";
import { draftImageDataAccess } from "../deps/dataAccess";
import useResponseHandler from "./useResponseHandler";
import IPlainApiError from "../../infrastructure/interfaces/IPlainApiError";
import IUploadDraftImagesResponseDTO from "../../infrastructure/contracts/uploadImages/IUploadDraftImagesResponseDTO";

export default function useUploadProductImages(props: { onSuccess: (dto: IUploadDraftImagesResponseDTO) => void; onError: (errors: IPlainApiError[]) => void }) {
    const responseHandler = useResponseHandler();
    const { onSuccess, onError } = props;

    return useCallback(
        
        async (files: File[]) => {
            const errors: IPlainApiError[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                await responseHandler({
                    requestFn: () =>
                        draftImageDataAccess.uploadImages({
                            files: [file],
                        }),
                    onResponseFn: async (response) => {
                        if (response.ok) {
                            const value: IUploadDraftImagesResponseDTO = await response.json();
                            onSuccess(value);
                            return ok(undefined);
                        } else if (response.status < 500 && response.status >= 400) {
                            const apiErrors: IPlainApiError[] = await response.json();
                            errors.push(...apiErrors);
                            return ok(undefined);
                        }

                        return err(undefined);
                    },
                });
            }

            if (errors.length) {
                onError(errors);
            }
        },
        [onError, onSuccess, responseHandler],
    );
}
