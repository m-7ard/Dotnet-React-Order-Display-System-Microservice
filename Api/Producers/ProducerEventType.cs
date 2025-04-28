using Domain.ValueObjects;

namespace Api.Producers;

public class ProducerEventType : ValueObject
{
    public static ProducerEventType OrderCreated => new ProducerEventType("orders/create");
    public static readonly List<ProducerEventType> ValidEventTypes = [OrderCreated];
    
    public string Value { get; set; }

    private ProducerEventType(string value)
    {
        Value = value;
    }

    public override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }
}