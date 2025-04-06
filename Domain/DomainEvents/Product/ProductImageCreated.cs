using Domain.Models;

namespace Domain.DomainEvents.Product;

public class ProductImageCreatedEvent : DomainEvent
{
    public ProductImageCreatedEvent(ProductImage payload) : base()
    {
        Payload = payload;
    }

    public ProductImage Payload { get; }
    public override string EventType => "PRODUCT_IMAGE_CREATED";
}