using Api.ApiModels;

namespace Api.DTOs.ProductHistories.List;

public class ListProductHistoriesResponseDTO
{
    public ListProductHistoriesResponseDTO(List<ProductHistoryApiModel> productHistories)
    {
        ProductHistories = productHistories;
    }

    public List<ProductHistoryApiModel> ProductHistories { get; set; }
}