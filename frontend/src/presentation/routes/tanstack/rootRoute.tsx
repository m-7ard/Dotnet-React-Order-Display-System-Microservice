import { createRootRoute } from "@tanstack/react-router";
import ApplicationLayout from "../../Application/Application.Layout";

const rootRoute = createRootRoute({
    component: () => <ApplicationLayout />,
});

export default rootRoute;
