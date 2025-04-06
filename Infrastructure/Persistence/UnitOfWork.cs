using Application.Interfaces.Persistence;

namespace Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    public IProductRepository ProductRepository { get; }
    public IProductHistoryRepository ProductHistoryRepository { get; }
    public IOrderRepository OrderRepository { get; }
    public IDraftImageRepository DraftImageRepository { get; }

    private readonly SimpleProductOrderServiceDbContext _dbContext;

    public UnitOfWork(SimpleProductOrderServiceDbContext dbContext, IProductRepository productRepository, IProductHistoryRepository productHistoryRepository, IOrderRepository orderRepository, IDraftImageRepository draftImageRepository)
    {
        _dbContext = dbContext;
        ProductRepository = productRepository;
        ProductHistoryRepository = productHistoryRepository;
        OrderRepository = orderRepository;
        DraftImageRepository = draftImageRepository;
    }


    public async Task SaveAsync()
    {
        await _dbContext.SaveChangesAsync();
    }
}
