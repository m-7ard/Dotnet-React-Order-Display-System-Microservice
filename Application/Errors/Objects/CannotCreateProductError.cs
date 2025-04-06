namespace Application.Errors.Objects;

public class CannotCreateProductError : ApplicationError
{
    public CannotCreateProductError(string message, List<string> path) : base(message, GeneralApplicationErrorCodes.CANNOT_CREATE_PRODUCT, path)
    {
        Message = message;
        Path = path;
    }
}