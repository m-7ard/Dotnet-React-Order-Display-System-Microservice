namespace Api.DTOs.Orders.Create;

public class CreateOrderRequestDTO
{
    public CreateOrderRequestDTO(Dictionary<string, OrderItem> orderItemData)
    {
        OrderItemData = orderItemData;
    }

    public Dictionary<string, OrderItem> OrderItemData { get; set; }

    public class OrderItem
    {
        public OrderItem(Guid productId, int quantity)
        {
            ProductId = productId;
            Quantity = quantity;
        }

        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }
}