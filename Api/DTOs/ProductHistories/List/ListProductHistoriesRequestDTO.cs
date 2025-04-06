namespace Api.DTOs.ProductHistories.List;

public class ListProductHistoriesRequestDTO
{
    public ListProductHistoriesRequestDTO(
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