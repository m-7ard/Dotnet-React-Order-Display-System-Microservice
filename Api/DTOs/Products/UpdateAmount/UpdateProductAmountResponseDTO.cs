namespace Api.DTOs.Products.UpdateAmount;

public class UpdateProductAmountResponseDTO
{
    public UpdateProductAmountResponseDTO(string id)
    {
        Id = id;
    }

    public string Id { get; set; }
}