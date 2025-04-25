import { Type } from "@sinclair/typebox";
import IPresentationError from "../../../interfaces/IPresentationError";
import { GeneratedFileName, RequiredImageFormData } from "../../../components/Forms/ImageUploadForm";
import useItemManager from "../../../hooks/useItemManager";
import validateTypeboxSchema from "../../../utils/validateTypeboxSchema";
import CreateProductPage from "./CreateProduct.Page";
import { useMutation } from "@tanstack/react-query";
import useResponseHandler from "../../../hooks/useResponseHandler";
import { productDataAccess } from "../../../deps/dataAccess";
import { err, ok } from "neverthrow";
import typeboxToDomainCompatibleFormError from "../../../mappers/typeboxToDomainCompatibleFormError";
import useUploadProductImages from "../../../hooks/useUploadProductImages";
import PresentationErrorFactory from "../../../mappers/PresentationErrorFactory";
import { useRouterNavigate } from "../../../routes/RouterModule/RouterModule.hooks";

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
    amount: Type.Number({
        minimum: 0,
        maximum: 10 ** 6,
    }),
});

export interface ValueState {
    name: string;
    description: string;
    price: string;
    images: Record<GeneratedFileName, RequiredImageFormData>;
    amount: string;
}

export type ErrorState = IPresentationError<{
    name: string[];
    images: Record<GeneratedFileName, string[]>;
    price: string[];
    description: string[];
    amount: string[];
}>;

const initialValueState: ValueState = {
    name: "",
    description: "",
    price: "",
    images: {},
    amount: ""
};

const initialErrorState: ErrorState = {};

export default function CreateProductController() {
    const responseHandler = useResponseHandler();
    const navigate = useRouterNavigate();

    const itemManager = useItemManager<ValueState>(initialValueState);
    const errorManager = useItemManager<ErrorState>(initialErrorState);

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

    const createProductMutation = useMutation({
        mutationFn: async () => {
            const values = itemManager.items;

            const imageFileNames = Object.values(values.images).map((value) => value.generatedFileName);

            const validation = validateTypeboxSchema(validatorSchema, {
                name: values.name,
                description: values.description,
                price: parseFloat(values.price),
                images: imageFileNames,
                amount: parseFloat(values.amount)
            });

            if (validation.isErr()) {
                const errors = typeboxToDomainCompatibleFormError(validation.error);
                errorManager.setAll(errors);
                return;
            }

            const data = validation.value;

            await responseHandler({
                requestFn: () =>
                    productDataAccess.createProduct({
                        name: data.name,
                        description: data.description,
                        price: data.price,
                        images: imageFileNames,
                        amount: data.amount
                    }),
                onResponseFn: async (response) => {
                    if (response.ok) {
                        navigate({ exp: (routes) => routes.LIST_PRODUCTS, params: {} });
                        return ok(1);
                    } else if (response.status === 400) {
                        const apiErrors = await response.json();
                        const errors = PresentationErrorFactory.ApiErrorsToPresentationErrors(apiErrors);
                        errorManager.setAll(errors);
                        return ok(2);
                    }

                    return err(5);
                },
                fallbackValue: 2
            });
        },
    });

    return (
        <CreateProductPage
            value={itemManager.items}
            errors={errorManager.items}
            onSubmit={() => {
                createProductMutation.mutate();
            }}
            uploadImages={uploadFiles}
            onReset={() => {
                itemManager.setAll(initialValueState);
                errorManager.setAll(initialErrorState);
            }}
            onChange={itemManager.setAll}
        />
    );
}
