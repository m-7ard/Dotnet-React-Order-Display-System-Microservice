using Domain.Models;

namespace Application.Handlers.ProductHistories.List;

public class ListProductHistoriesResult
{
    public ListProductHistoriesResult(List<ProductHistory> productHistories)
    {
        ProductHistories = productHistories;
    }

    public List<ProductHistory> ProductHistories { get; set; }
}