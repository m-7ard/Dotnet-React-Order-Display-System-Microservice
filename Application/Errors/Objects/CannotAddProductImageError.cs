namespace Application.Errors.Objects;

public class CannotAddProductImageError : ApplicationError
{
    public CannotAddProductImageError(string message, List<string> path) : base(message, GeneralApplicationErrorCodes.CANNOT_ADD_PRODUCT_IMAGE, path)
    {
        Message = message;
        Path = path;
    }
}