namespace Api.DTOs.Products.Create;

public class CreateProductResponseDTO
{
    public CreateProductResponseDTO(string id)
    {
        Id = id;
    }

    public string Id { get; set; }
}