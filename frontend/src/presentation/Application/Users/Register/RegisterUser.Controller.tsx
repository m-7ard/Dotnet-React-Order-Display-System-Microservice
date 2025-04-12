import { Type } from "@sinclair/typebox";
import IPresentationError from "../../../interfaces/IPresentationError";
import useItemManager from "../../../hooks/useItemManager";
import validateTypeboxSchema from "../../../utils/validateTypeboxSchema";
import RegisterUserPage from "./RegisterUser.Page";
import { useMutation } from "@tanstack/react-query";
import typeboxToDomainCompatibleFormError from "../../../mappers/typeboxToDomainCompatibleFormError";
import { useRouterNavigate } from "../../../routes/RouterModule/RouterModule.hooks";
import { useAuthServiceContext } from "../../Application.AuthServiceProvider.Context";

const validatorSchema = Type.Object({
    username: Type.String({
        minLength: 1,
        maxLength: 255,
    }),
    email: Type.String({
        minLength: 1,
        maxLength: 255
    }),
    password: Type.String({
        minLength: 8,
        maxLength: 255,
    }),
});

export interface ValueState {
    username: string;
    email: string;
    password: string;
}

export type ErrorState = IPresentationError<{
    username: string[];
    email: string[];
    password: string[];
}>;

const initialValueState: ValueState = {
    username: "",
    email: "",
    password: "",
};

const initialErrorState: ErrorState = {};

export default function RegisterUserController() {
    // Deps
    const navigate = useRouterNavigate();
    const authService = useAuthServiceContext();

    // State
    const itemManager = useItemManager<ValueState>(initialValueState);
    const errorManager = useItemManager<ErrorState>(initialErrorState);

    // Actions
    const registerUserMutation = useMutation({
        mutationFn: async () => {
            const values = itemManager.items;

            const validation = validateTypeboxSchema(validatorSchema, {
                username: values.username,
                email: values.email,
                password: values.password,
            });

            if (validation.isErr()) {
                const errors = typeboxToDomainCompatibleFormError(validation.error);
            console.log(errors)
            errorManager.setAll(errors);
                return;
            }

            const data = validation.value;

            const result = await authService.register({
                username: data.username,
                email: data.email,
                password: data.password,
            });


            if (result.isOk()) {
                navigate({ exp: (routes) => routes.LOGIN_USER, params: {} });
                return;
            }

            errorManager.setAll(result.error);
        },
    });

    return (
        <RegisterUserPage
            value={itemManager.items}
            errors={errorManager.items}
            onSubmit={() => {
                registerUserMutation.mutate();
            }}
            onReset={() => {
                itemManager.setAll(initialValueState);
                errorManager.setAll(initialErrorState);
            }}
            onChange={itemManager.setAll}
        />
    );
}
