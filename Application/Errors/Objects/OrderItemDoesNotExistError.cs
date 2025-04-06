namespace Application.Errors.Objects;

public class OrderItemDoesNotExistError : ApplicationError
{
    public OrderItemDoesNotExistError(string message, List<string> path) : base(message, GeneralApplicationErrorCodes.ORDER_ITEM_DOES_NOT_EXIST, path)
    {
        Message = message;
        Path = path;
    }
}