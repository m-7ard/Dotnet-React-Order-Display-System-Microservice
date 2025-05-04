import IOrderEventService from "../../infrastructure/interfaces/eventServices/IOrderEventService";
import createSafeContext from "../utils/createSafeContext";

export const [EventServiceContext, useEventServiceContext] = createSafeContext<{
    open: boolean;
    orderEventService: IOrderEventService
}>("useEventServiceContext must be used within EventServiceContext.Provider");