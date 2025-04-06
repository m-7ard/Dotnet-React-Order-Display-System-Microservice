using Api.ApiModels;

namespace Api.DTOs.Orders.List;

public class ListOrdersResponseDTO
{
    public ListOrdersResponseDTO(List<OrderApiModel> orders)
    {
        Orders = orders;
    }

    public List<OrderApiModel> Orders { get; set; }
}