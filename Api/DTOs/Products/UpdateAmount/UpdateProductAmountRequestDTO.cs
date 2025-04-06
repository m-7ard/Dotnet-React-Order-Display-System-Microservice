namespace Api.DTOs.Products.UpdateAmount;

public class UpdateProductAmountRequestDTO
{
    public int Amount { get; set; }

    public UpdateProductAmountRequestDTO(int amount)
    {
        Amount = amount;
    }
}