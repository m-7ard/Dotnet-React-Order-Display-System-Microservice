import IEventServiceListenerFn from "./IEventServiceListenerFn";

type TEventServiceListenerIdentifier = {
    fn: IEventServiceListenerFn;
    uuid: string;
};

export default TEventServiceListenerIdentifier;
