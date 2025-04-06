namespace Application.Errors.Objects;

public class CannotTransitionOrderStatusError : ApplicationError
{
    public CannotTransitionOrderStatusError(string message, List<string> path) : base(message, GeneralApplicationErrorCodes.CANNOT_TRANSITION_ORDER_STATUS, path)
    {
        Message = message;
        Path = path;
    }
}