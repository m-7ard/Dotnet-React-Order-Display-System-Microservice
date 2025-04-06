using OneOf;

namespace Domain.ValueObjects.Shared;

public class FileName : ValueObject
{
    public static readonly List<string> ALLOWED_FILE_EXTENSIONS = [".jpg", ".jpeg", ".png"];
    private FileName(string value)
    {
        Value = value;
    }

    public string Value { get; }

    public static OneOf<bool, string> CanCreate(string value)
    {
        var fileNameExtension = Path.GetExtension(value);

        if (!ALLOWED_FILE_EXTENSIONS.Contains(fileNameExtension))
        {
            return "FileName extension is invalid.";
        }

        return true;
    }

    public static FileName ExecuteCreate(string value)
    {
        return new FileName(value);
    }

    public override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }
    public override string ToString()
    {
        return Value.ToString();
    }
}