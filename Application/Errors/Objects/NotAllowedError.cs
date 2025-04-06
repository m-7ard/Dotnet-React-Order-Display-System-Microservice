namespace Application.Errors.Objects;

public class NotAllowedError : ApplicationError
{
    public NotAllowedError(string message, List<string> path) : base(message, GeneralApplicationErrorCodes.NOT_ALLOWED, path)
    {
        Message = message;
        Path = path;
    }
}