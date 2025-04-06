import { PropsWithChildren } from "react";
import ExceptionProvider from "./Application.ExceptionProvider";
import GlobalDialogManager from "../components/Dialog/GlobalDialog.Manager";
import { useLocation } from "@tanstack/react-router";
import DataAccessProvider from "./Application.DataAccessProvider";

export default function ApplicationProvider({ children }: PropsWithChildren) {
    const location = useLocation();

    return (
        <ExceptionProvider>
            <DataAccessProvider>
                <GlobalDialogManager href={location.href}>
                    <DataAccessProvider>{children}</DataAccessProvider>
                </GlobalDialogManager>
            </DataAccessProvider>
        </ExceptionProvider>
    );
}
