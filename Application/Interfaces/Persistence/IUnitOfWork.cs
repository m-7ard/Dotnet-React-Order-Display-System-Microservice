namespace Application.Interfaces.Persistence;

public interface IUnitOfWork
{
    public IProductRepository ProductRepository { get; }
    public IProductHistoryRepository ProductHistoryRepository { get; }
    public IOrderRepository OrderRepository { get; }
    public IDraftImageRepository DraftImageRepository { get; }
    public Task SaveAsync();
}