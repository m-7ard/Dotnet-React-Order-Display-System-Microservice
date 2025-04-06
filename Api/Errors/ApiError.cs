namespace Api.Errors;
public class ApiError
{
    public string Path { get; set; }
    public string Message { get; set; }
    public string Code { get; set; }

    public ApiError(string code, string path, string message)
    {
        Path = path;
        Message = message;
        Code = code;
    }
}