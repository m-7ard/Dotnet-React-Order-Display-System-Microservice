import UpdateProductPage from "./UpdateProduct.Page";
import { Type } from "@sinclair/typebox";
import IPresentationError from "../../../interfaces/IPresentationError";
import { UploadImageFormValue, GeneratedFileName } from "../../../components/Forms/ImageUploadForm";
import useItemManager from "../../../hooks/useItemManager";
import { useMutation } from "@tanstack/react-query";
import typeboxToDomainCompatibleFormError from "../../../mappers/typeboxToDomainCompatibleFormError";
import validateTypeboxSchema from "../../../utils/validateTypeboxSchema";
import useResponseHandler from "../../../hooks/useResponseHandler";
import { productDataAccess } from "../../../deps/dataAccess";
import { err, ok } from "neverthrow";
import useUploadProductImages from "../../../hooks/useUploadProductImages";
import PresentationErrorFactory from "../../../mappers/PresentationErrorFactory";
import { useRouterLoaderData, useRouterNavigate } from "../../../routes/RouterModule/RouterModule.hooks";

const validatorSchema = Type.Object({
    name: Type.String({
        minLength: 1,
        maxLength: 255,
    }),
    description: Type.String({
        maxLength: 1028,
    }),
    price: Type.Number({
        minimum: 0.01,
        maximum: 10 ** 6,
    }),
    images: Type.Array(Type.String({ customPath: "/images/_" }), { maxItems: 8, suffixPath: "/_" }),
});

export interface ValueSchema {
    name: string;
    description: string;
    price: string;
    images: UploadImageFormValue;
}

export type ErrorSchema = IPresentationError<{
    name: string[];
    images: Record<GeneratedFileName, string[]>;
    price: string[];
    description: string[];
}>;

const initialErrorState: ErrorSchema = {};

export default function UpdateProductController() {
    const { product } = useRouterLoaderData((keys) => keys.UPDATE_PRODUCT);

    const responseHandler = useResponseHandler();
    const initialValueState: ValueSchema = {
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        images: product.images.reduce<UploadImageFormValue>((acc, imageData) => {
            const generatedFileName = imageData.fileName as GeneratedFileName;
            return {
                ...acc,
                [generatedFileName]: {
                    generatedFileName: generatedFileName,
                    originalFileName: imageData.originalFileName,
                    url: imageData.url,
                },
            };
        }, {}),
    };

    const itemManager = useItemManager<ValueSchema>(initialValueState);
    const errorManager = useItemManager<ErrorSchema>(initialErrorState);

    const navigate = useRouterNavigate();
    const updateProductMutation = useMutation({
        mutationFn: async () => {
            const images = Object.keys(itemManager.items.images);
            const validation = validateTypeboxSchema(validatorSchema, {
                name: itemManager.items.name,
                description: itemManager.items.description,
                price: parseFloat(itemManager.items.price),
                images: images,
            });

            if (validation.isErr()) {
                const errors = typeboxToDomainCompatibleFormError(validation.error);
                errorManager.setAll(errors);
                return;
            }

            await responseHandler({
                requestFn: () =>
                    productDataAccess.updateProduct({
                        id: product.id,
                        name: itemManager.items.name,
                        description: itemManager.items.description,
                        price: parseFloat(itemManager.items.price),
                        images: images,
                    }),
                onResponseFn: async (response) => {
                    if (response.ok) {
                        navigate({ exp: (routes) => routes.LIST_PRODUCTS, params: {}, search: { productId: product.id } });
                        return ok(undefined);
                    } else if (response.status === 400) {
                        const errors = PresentationErrorFactory.ApiErrorsToPresentationErrors(await response.json());
                        errorManager.setAll(errors);
                        return ok(undefined);
                    }

                    return err(undefined);
                },
            });
        },
    });

    const uploadFiles = useUploadProductImages({
        onSuccess: (dto) => {
            itemManager.updateItem("images", (prev) => {
                const imageData = dto.images[0];
                const generatedFileName = imageData.fileName as GeneratedFileName;

                const newState = { ...prev };
                newState[generatedFileName] = {
                    generatedFileName: generatedFileName,
                    originalFileName: imageData.originalFileName,
                    url: imageData.url,
                };
                return newState;
            });
        },
        onError: (errors) => {
            errorManager.updateItem("images", {
                _: errors.map(({ message }) => message),
            });
        },
    });

    return product == null ? null : (
        <UpdateProductPage
            value={itemManager.items}
            errors={errorManager.items}
            onChange={itemManager.setAll}
            onReset={() => itemManager.setAll(initialValueState)}
            onSubmit={() => updateProductMutation.mutate()}
            product={product}
            uploadImages={uploadFiles}
        />
    );
}
