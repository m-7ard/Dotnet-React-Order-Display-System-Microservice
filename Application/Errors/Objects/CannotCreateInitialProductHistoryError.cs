namespace Application.Errors.Objects;

public class CannotCreateInitialProductHistoryError : ApplicationError
{
    public CannotCreateInitialProductHistoryError(string message, List<string> path) : base(message, GeneralApplicationErrorCodes.CANNOT_CREATE_INITIAL_PRODUCT_HISTORY, path)
    {
        Message = message;
        Path = path;
    }
}