import { createRoute } from "@tanstack/react-router";
import rootRoute from "../rootRoute";
import FrontpagePage from "../../../Application/Frontpage/Frontpage.Page";
import { tanstackConfigs } from "../tanstackConfig";
import AuthRouteGuard from "../../../components/RouteGuards/AuthRouteGuard";

const frontPageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: tanstackConfigs.FRONTPAGE.pattern,
    component: () => (
        <AuthRouteGuard>
            <FrontpagePage />
        </AuthRouteGuard>
    ),
});

export default [frontPageRoute];
