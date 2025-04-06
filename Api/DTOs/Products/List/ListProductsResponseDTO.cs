using Api.ApiModels;

namespace Api.DTOs.Products.List;

public class ListProductsResponseDTO
{
    public ListProductsResponseDTO(List<ProductApiModel> products)
    {
        Products = products;
    }

    public List<ProductApiModel> Products { get; set; }
}