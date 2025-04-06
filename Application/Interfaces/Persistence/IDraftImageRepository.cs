using Domain.Models;
using Domain.ValueObjects.Shared;

namespace Application.Interfaces.Persistence;

public interface IDraftImageRepository
{
    Task CreateAsync(DraftImage draftImage);
    Task LazyCreateAsync(DraftImage draftImage);
    Task<DraftImage?> GetByFileNameAsync(FileName fileName);
    Task DeleteByFileNameAsync(FileName fileName);
    Task LazyDeleteByFileNameAsync(FileName fileName);
}