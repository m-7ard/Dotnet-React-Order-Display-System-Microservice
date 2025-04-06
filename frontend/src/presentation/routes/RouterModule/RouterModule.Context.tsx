import createSafeContext from "../../utils/createSafeContext";
import { IRouterModule } from "./RouterModule";

export const [RouterModuleContext, useRouterModuleContext] = createSafeContext<IRouterModule>(
    "useRouterModuleContext must be used within RouterModuleContext.Provider.",
);
