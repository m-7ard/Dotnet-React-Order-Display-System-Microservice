using Application.Errors;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.List;

public class ListProductsQuery : IRequest<OneOf<ListProductsResult, List<ApplicationError>>>
{
    public ListProductsQuery(string? name, decimal? minPrice, decimal? maxPrice, string? description, DateTime? createdBefore, DateTime? createdAfter, Guid? id, string? orderBy)
    {
        Name = name;
        MinPrice = minPrice;
        MaxPrice = maxPrice;
        Description = description;
        CreatedBefore = createdBefore;
        CreatedAfter = createdAfter;
        Id = id;
        OrderBy = orderBy;
    }

    public Guid? Id { get; set; }
    public string? Name { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? Description { get; set; }
    public DateTime? CreatedBefore { get; set; }
    public DateTime? CreatedAfter { get; set; }
    public string? OrderBy { get; set; }
}