import RouterModule from "./RouterModule/RouterModule";
import { IRouter } from "./interfaces/IRouter";

export default function CreateRouter({ router }: { router: IRouter }) {
    return <RouterModule {...router.routerModule}>{router.render()}</RouterModule>;
}
