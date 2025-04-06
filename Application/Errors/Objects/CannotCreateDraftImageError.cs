namespace Application.Errors.Objects;

public class CannotCreateDraftImageError : ApplicationError
{
    public CannotCreateDraftImageError(string message, List<string> path) : base(message, GeneralApplicationErrorCodes.CANNOT_CREATE_DRAFT_IMAGE, path)
    {
        Message = message;
        Path = path;
    }
}