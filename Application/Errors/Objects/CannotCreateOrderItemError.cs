namespace Application.Errors.Objects;

public class CannotCreateOrderItemError : ApplicationError
{
    public CannotCreateOrderItemError(string message, List<string> path) : base(message, GeneralApplicationErrorCodes.CANNOT_CREATE_ORDER_ITEM, path)
    {
        Message = message;
        Path = path;
    }
}