using Api.ApiModels;

namespace Api.DTOs.Orders.Create;

public class CreateOrderResponseDTO
{
    public CreateOrderResponseDTO(string orderId)
    {
        OrderId = orderId;
    }

    public string OrderId { get; set; }
}