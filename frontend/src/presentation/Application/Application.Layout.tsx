import { Outlet } from "@tanstack/react-router";
import ApplicationExceptionNotice from "./Application.ExceptionNotice";
import ApplicationHeader from "./Application.Header";
import ApplicationProvider from "./Application.Provider";
import { useRouterCurrentRoute } from "../routes/RouterModule/RouterModule.hooks";

export default function ApplicationLayout() {
    const currentRoute = useRouterCurrentRoute();
    
    return (
        <ApplicationProvider>
            <h1 className="hidden">{currentRoute.description}</h1>
            <main className="flex flex-col h-full w-full mx-auto overflow-hidden text-gray-800">
                <ApplicationExceptionNotice />
                <ApplicationHeader />
                <div className="flex flex-col grow overflow-auto">
                    <Outlet />
                </div>
            </main>
        </ApplicationProvider>
    );
}
