using Api.ApiModels;

namespace Api.DTOs.Orders.Read;

public class ReadOrderResponseDTO
{
    public ReadOrderResponseDTO(OrderApiModel order)
    {
        Order = order;
    }

    public OrderApiModel Order { get; set; }
}