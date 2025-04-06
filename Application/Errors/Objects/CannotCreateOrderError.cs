namespace Application.Errors.Objects;

public class CannotCreateOrderError : ApplicationError
{
    public CannotCreateOrderError(string message, List<string> path) : base(message, GeneralApplicationErrorCodes.CANNOT_CREATE_ORDER, path)
    {
        Message = message;
        Path = path;
    }
}