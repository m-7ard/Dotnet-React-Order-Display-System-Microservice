namespace Application.Errors;

public class ApplicationError
{
    public ApplicationError(string message, string code, List<string> path)
    {
        Message = message;
        Code = code;
        Path = path;
    }

    public string Message { get; set; }
    public List<string> Path { get; set; }
    public string Code { get; set; }

    public List<ApplicationError> AsList()
    {
        return [this];
    }
}