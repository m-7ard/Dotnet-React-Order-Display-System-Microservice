namespace Application.Errors.Objects;

public class CannotInvalidateProductHistoryError : ApplicationError
{
    public CannotInvalidateProductHistoryError(string message, List<string> path) : base(message, GeneralApplicationErrorCodes.CANNOT_CREATE_ORDER, path)
    {
        Message = message;
        Path = path;
    }
}