using Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Files;

public class FileStorage : IFileStorage
{
    public async Task SaveFile(IFormFile file, string path, CancellationToken cancellationToken)
    {
        using (Stream fileStream = new FileStream(path, FileMode.Create))
        {
            await file.CopyToAsync(fileStream, cancellationToken);
        }
    }
}