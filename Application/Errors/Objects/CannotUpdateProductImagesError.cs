namespace Application.Errors.Objects;

public class CannotUpdateProductImagesError : ApplicationError
{
    public CannotUpdateProductImagesError(string message, List<string> path) : base(message, GeneralApplicationErrorCodes.CANNOT_UPDATE_PRODUCT_IMAGES, path)
    {
        Message = message;
        Path = path;
    }
}