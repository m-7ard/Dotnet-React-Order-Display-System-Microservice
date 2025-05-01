import { PropsWithChildren, useEffect, useState } from "react";
import { EventServiceContext } from "./Application.EventServiceProvider.Context";
import { orderEventService, websocketSingleton } from "../deps/eventServices";

export default function EventServiceProvider(props: PropsWithChildren) {
    const { children } = props;
    const [open, setOpen] = useState(websocketSingleton.open);
    useEffect(() => {
        websocketSingleton.registerOnToggle((status) => setOpen(status));
    }, []);

    return (
        <EventServiceContext.Provider
            value={{
                open: open,
                orderEventService: orderEventService,
            }}
        >
            {children}
        </EventServiceContext.Provider>
    );
}
