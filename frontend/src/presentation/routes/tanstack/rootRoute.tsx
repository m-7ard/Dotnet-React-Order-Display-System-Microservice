import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import ApplicationLayout from "../../Application/Application.Layout";
import AuthRouteGuard from "../../components/RouteGuards/AuthRouteGuard";

const rootRoute = createRootRoute({
    component: () => <ApplicationLayout />,
});

export const authRootRoute = createRoute({
    getParentRoute: () => rootRoute,
    component: () => (
        <AuthRouteGuard>
            <Outlet />
        </AuthRouteGuard>
    ),
    id: "authLayout"
});

export default rootRoute;
