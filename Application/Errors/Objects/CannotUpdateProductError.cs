namespace Application.Errors.Objects;

public class CannotUpdateProductError : ApplicationError
{
    public CannotUpdateProductError(string message, List<string> path) : base(message, GeneralApplicationErrorCodes.CANNOT_UPDATE_PRODUCT, path)
    {
        Message = message;
        Path = path;
    }
}