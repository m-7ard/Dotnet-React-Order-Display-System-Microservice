using Domain.Models;

namespace Domain.DomainEvents.Product;

public class ProductImageDeletedEvent : DomainEvent
{
    public ProductImageDeletedEvent(ProductImage payload) : base()
    {
        Payload = payload;
    }

    public ProductImage Payload { get; }
    public override string EventType => "PRODUCT_IMAGE_DELETED";
}