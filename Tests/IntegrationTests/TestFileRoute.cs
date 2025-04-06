using Application.Common;

namespace Tests.IntegrationTests;

public class TestFileRoute
{
    public static TestFileRoute ValidImage => new TestFileRoute(
        value: Path.Combine(DirectoryService.GetProjectRoot(), "Tests", "TestFiles", "Images", "valid-1.jpg")
    );
    public static TestFileRoute TooLargeImage => new TestFileRoute(
        value: Path.Combine(DirectoryService.GetProjectRoot(), "Tests", "TestFiles", "Images", "too-large-image.png")
    );
    public static TestFileRoute TextFile => new TestFileRoute(
        value: Path.Combine(DirectoryService.GetProjectRoot(), "Tests", "TestFiles", "Images", "valid-1.text-file")
    );

    public string Value { get; }

    public TestFileRoute(string value)
    {
        Value = value;
    }
}