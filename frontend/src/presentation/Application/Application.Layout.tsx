import { Outlet } from "@tanstack/react-router";
import ApplicationExceptionNotice from "./Application.ExceptionNotice";
import ApplicationHeader from "./Application.Header";
import ApplicationProvider from "./Application.Provider";

export default function ApplicationLayout() {
    return (
        <ApplicationProvider>
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
