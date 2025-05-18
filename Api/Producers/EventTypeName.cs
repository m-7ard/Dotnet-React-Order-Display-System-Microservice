using Domain.ValueObjects;

namespace Api.Producers;

public class EventTypeName : ValueObject
{
    public string Value { get; set; }

    protected EventTypeName(string value)
    {
        Value = value;
    }

    public override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }
}