using Application.Errors;

namespace Tests.UnitTests.Utils;

public static class EmptyApplicationError
{
    public static readonly ApplicationError Instance = new ApplicationError(message: "", code: "", path: []);
}
