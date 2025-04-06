namespace Application.Interfaces.Persistence;

public interface ISequenceService
{
    Task<int> LazyGetNextValueAsync(string sequenceId);
    Task<int> GetNextOrderValueAsync();
    Task<int> GetNextOrderItemValueAsync();
}