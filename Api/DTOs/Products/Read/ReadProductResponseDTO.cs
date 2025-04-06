using Api.ApiModels;

namespace Api.DTOs.Products.Read;

public class ReadProductResponseDTO
{
    public ReadProductResponseDTO(ProductApiModel product)
    {
        Product = product;
    }

    public ProductApiModel Product { get; set; }
}