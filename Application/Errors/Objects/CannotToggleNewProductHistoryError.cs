namespace Application.Errors.Objects;

public class CannotToggleNewProductHistoryError : ApplicationError
{
    public CannotToggleNewProductHistoryError(string message, List<string> path) : base(message, GeneralApplicationErrorCodes.CANNOT_TOGGLE_NEW_PRODUCT_HISTORY, path)
    {
        Message = message;
        Path = path;
    }
}