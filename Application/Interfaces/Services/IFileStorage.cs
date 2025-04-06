
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces.Services;

public interface IFileStorage
{
    public Task SaveFile(IFormFile file, string path, CancellationToken cancellationToken);
}