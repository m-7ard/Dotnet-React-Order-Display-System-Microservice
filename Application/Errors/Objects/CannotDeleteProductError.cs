namespace Application.Errors.Objects;

public class CannotDeleteProductError : ApplicationError
{
    public CannotDeleteProductError(string message, List<string> path) : base(message, GeneralApplicationErrorCodes.CANNOT_DELETE_PRODUCT, path)
    {
        Message = message;
        Path = path;
    }
}