namespace Api.Producers;

public class ProductEventTypeName : EventTypeName
{
    private ProductEventTypeName(string value) : base(value) { }
    public static ProductEventTypeName OrderCreated => new ProductEventTypeName("orders/create");
    public static ProductEventTypeName OrderUpdated => new ProductEventTypeName("orders/update");
}