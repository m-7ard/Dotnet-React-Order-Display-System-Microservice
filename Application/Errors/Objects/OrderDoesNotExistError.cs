namespace Application.Errors.Objects;

public class OrderDoesNotExistError : ApplicationError
{
    public OrderDoesNotExistError(string message, List<string> path) : base(message, GeneralApplicationErrorCodes.ORDER_DOES_NOT_EXIST, path)
    {
        Message = message;
        Path = path;
    }
}