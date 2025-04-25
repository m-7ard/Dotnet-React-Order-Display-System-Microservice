import { Type } from "@sinclair/typebox";
import IPresentationError from "../../../interfaces/IPresentationError";
import useItemManager from "../../../hooks/useItemManager";
import validateTypeboxSchema from "../../../utils/validateTypeboxSchema";
import LoginUserPage from "./LoginUser.Page";
import { useMutation } from "@tanstack/react-query";
import typeboxToDomainCompatibleFormError from "../../../mappers/typeboxToDomainCompatibleFormError";
import { useRouterNavigate } from "../../../routes/RouterModule/RouterModule.hooks";
import { useAuthServiceContext } from "../../Application.AuthServiceProvider.Context";

const validatorSchema = Type.Object({
    username: Type.String({
        minLength: 1,
        maxLength: 255,
    }),
    password: Type.String({
        minLength: 8,
        maxLength: 255,
    }),
});

export interface ValueState {
    username: string;
    password: string;
}

export type ErrorState = IPresentationError<{
    username: string[];
    password: string[];
}>;

const initialValueState: ValueState = {
    username: "",
    password: "",
};

const initialErrorState: ErrorState = {};

export default function LoginUserController() {
    // Deps
    const navigate = useRouterNavigate();
    const authService = useAuthServiceContext();

    // State
    const itemManager = useItemManager<ValueState>(initialValueState);
    const errorManager = useItemManager<ErrorState>(initialErrorState);

    // Actions
    const loginUserMutation = useMutation({
        mutationFn: async () => {
            errorManager.setAll({});
            const values = itemManager.items;

            const validation = validateTypeboxSchema(validatorSchema, {
                password: values.password,
                username: values.username,
            });
            if (validation.isErr()) {
                const errors = typeboxToDomainCompatibleFormError(validation.error);
                errorManager.setAll(errors);
                return;
            }

            const data = validation.value;

            const result = await authService.login({
                username: data.username,
                password: data.password,
            });

            if (result.isOk()) {
                setTimeout(() => {
                    // Wait for user state to be updated
                    navigate({ exp: (routes) => routes.FRONTPAGE, params: {} });
                }, 0);
                return;
            }

            errorManager.setAll(result.error);
        },
    });

    return (
        <LoginUserPage
            value={itemManager.items}
            errors={errorManager.items}
            onSubmit={() => {
                loginUserMutation.mutate();
            }}
            onReset={() => {
                itemManager.setAll(initialValueState);
                errorManager.setAll(initialErrorState);
            }}
            onChange={itemManager.setAll}
        />
    );
}
