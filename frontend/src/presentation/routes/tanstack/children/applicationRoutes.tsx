import { createRoute } from "@tanstack/react-router";
import rootRoute from "../rootRoute";
import FrontpagePage from "../../../Application/Frontpage/Frontpage.Page";
import { tanstackConfigs } from "../tanstackConfig";

const frontPageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: tanstackConfigs.FRONTPAGE.pattern,
    component: FrontpagePage,
});

export default [
    frontPageRoute
]