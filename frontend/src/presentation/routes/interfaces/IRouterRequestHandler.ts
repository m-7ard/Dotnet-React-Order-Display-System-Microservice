export default interface IRouterRequestHandler {
    handleRequest(promise: Promise<Response>): Promise<Response>;
    handleInvalidResponse(response: Response): Promise<void>;
}
