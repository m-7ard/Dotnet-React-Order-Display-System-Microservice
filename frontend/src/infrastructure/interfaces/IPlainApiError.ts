type IPlainApiError = {
    code: "APPLICATION_ERROR" | "VALIDATION_ERROR",
    path: string,
    message: string,
}

export default IPlainApiError;
