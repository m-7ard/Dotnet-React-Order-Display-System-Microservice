using System.Reflection;

namespace Application.Common;

public class DirectoryService
{
    private static readonly List<string> _projects = ["Application", "Api", "Domain", "Files", "Infrastructure", "Tests"];
    
    public static string GetProjectRoot()
    {
        // If we're in Docker, use the container path
        if (Environment.GetEnvironmentVariable("DOCKER_ENVIRONMENT") == "true")
        {
            return "/app";
        }

        var assembly = Assembly.GetExecutingAssembly();
        var dir = new DirectoryInfo(assembly.Location);
        while (!_projects.Contains(dir!.Name))
        {
            dir = Directory.GetParent(dir.FullName);
        }
        
        dir = Directory.GetParent(dir.FullName);
        return dir!.FullName;
    }

    public static string GetMediaDirectory()
    {
        var projectRoot = GetProjectRoot();
        
        if (Environment.GetEnvironmentVariable("DOCKER_ENVIRONMENT") == "true")
        {
            return "/app/media";  // Use the Docker volume path
        }

        var appRoot = Path.Join(projectRoot, "Files");
        if (Environment.GetEnvironmentVariable("IS_TEST") == "true")
        {
            return Path.Join(appRoot, "Media/Tests");
        }

        return Path.Join(appRoot, "Media");
    }
}