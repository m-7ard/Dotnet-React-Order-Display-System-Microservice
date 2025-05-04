import { PropsWithChildren } from "react";
import ExceptionProvider from "./Application.ExceptionProvider";
import GlobalDialogManager from "../components/Dialog/GlobalDialog.Manager";
import { useLocation } from "@tanstack/react-router";
import DataAccessProvider from "./Application.DataAccessProvider";
import AuthServiceProvider from "./Application.AuthServiceProvider";
import EventServiceProvider from "./Application.EventServiceProvider";

export default function ApplicationProvider({ children }: PropsWithChildren) {
    const location = useLocation();

    return (
        <ExceptionProvider>
            <DataAccessProvider>
                <AuthServiceProvider href={location.href}>
                    <EventServiceProvider>
                        <GlobalDialogManager href={location.href}>{children}</GlobalDialogManager>
                    </EventServiceProvider>
                </AuthServiceProvider>
            </DataAccessProvider>
        </ExceptionProvider>
    );
}
