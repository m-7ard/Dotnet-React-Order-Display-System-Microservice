import IPresentationError from "../../interfaces/IPresentationError";

type TDataAccessFn<Request, Response> = (req: Request, callbacks: { onError: (errors: IPresentationError<object>) => void, onSuccess: (res: Response) => void }) => Promise<void>;
export default TDataAccessFn;