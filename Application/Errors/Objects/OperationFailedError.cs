namespace Application.Errors.Objects;

public class OperationFailedError : ApplicationError
{
    public OperationFailedError(string message, List<string> path) : base(message, GeneralApplicationErrorCodes.OPERATION_FAILED, path)
    {
        Message = message;
        Path = path;
    }
}