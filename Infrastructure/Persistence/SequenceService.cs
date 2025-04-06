using Application.Interfaces.Persistence;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Persistence;

public class SequenceService : ISequenceService
{
    private readonly SimpleProductOrderServiceDbContext _context;
    private readonly ILogger<SequenceService> _logger;

    public SequenceService(SimpleProductOrderServiceDbContext context, ILogger<SequenceService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<int> GetNextOrderValueAsync()
    {
        return await LazyGetNextValueAsync("OrderNumber");
    }

    public async Task<int> GetNextOrderItemValueAsync()
    {
        return await LazyGetNextValueAsync("OrderItemNumber");
    }

    public async Task<int> LazyGetNextValueAsync(string sequenceId)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        
        try
        {
            var sequence = await _context.Sequence.FindAsync(sequenceId);
            if (sequence is null)
            {
                throw new InvalidOperationException($"Sequence '{sequenceId}' not found.");
            }

            sequence.CurrentValue += 1;
            await transaction.CommitAsync();

            return sequence.CurrentValue;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error getting next value for sequence {SequenceId}", sequenceId);
            throw;
        }
    }
}