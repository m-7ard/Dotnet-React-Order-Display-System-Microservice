namespace Application.Errors.Objects;

public class ProductHistoryDoesNotExistError : ApplicationError
{
    public ProductHistoryDoesNotExistError(string message, List<string> path) : base(message, GeneralApplicationErrorCodes.PRODUCT_DOES_NOT_EXIST, path)
    {
        Message = message;
        Path = path;
    }
}