namespace Application.Errors.Objects;

public class CannotTransitionOrderItemStatusError : ApplicationError
{
    public CannotTransitionOrderItemStatusError(string message, List<string> path) : base(message, GeneralApplicationErrorCodes.CANNOT_TRANSITION_ORDER_ITEM_STATUS, path)
    {
        Message = message;
        Path = path;
    }
}