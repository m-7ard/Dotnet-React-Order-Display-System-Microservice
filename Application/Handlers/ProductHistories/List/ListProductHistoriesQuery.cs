using Application.Errors;
using MediatR;
using OneOf;

namespace Application.Handlers.ProductHistories.List;

public class ListProductHistoriesQuery : IRequest<OneOf<ListProductHistoriesResult, List<ApplicationError>>>
{
    public ListProductHistoriesQuery(
        string? name,
        decimal? minPrice,
        decimal? maxPrice,
        string? description,
        DateTime? validTo,
        DateTime? validFrom,
        Guid? productId,
        string? orderBy)
    {
        Name = name;
        MinPrice = minPrice;
        MaxPrice = maxPrice;
        Description = description;
        ValidTo = validTo;
        ValidFrom = validFrom;
        ProductId = productId;
        OrderBy = orderBy;
    }

    public string? Name { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? Description { get; set; }
    public DateTime? ValidTo { get; set; }
    public DateTime? ValidFrom { get; set; }
    public Guid? ProductId { get; set; }
    public string? OrderBy { get; set; }
}