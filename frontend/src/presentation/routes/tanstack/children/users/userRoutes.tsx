import { createRoute } from "@tanstack/react-router";
import rootRoute from "../../rootRoute";
import { tanstackConfigs } from "../../tanstackConfig";
import RegisterUserController from "../../../../Application/Users/Register/RegisterUser.Controller";
import LoginUserController from "../../../../Application/Users/Login/LoginUser.Controller";

const registerUserRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: tanstackConfigs.REGISTER_USER.pattern,
    component: RegisterUserController,
});

const loginUserRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: tanstackConfigs.LOGIN_USER.pattern,
    component: LoginUserController,
});

export default [registerUserRoute, loginUserRoute];
