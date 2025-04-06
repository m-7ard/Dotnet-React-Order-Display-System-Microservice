namespace Api.DTOs.Products.Update;

public class UpdateProductResponseDTO
{
    public UpdateProductResponseDTO(string id)
    {
        Id = id;
    }

    public string Id { get; set; }
}