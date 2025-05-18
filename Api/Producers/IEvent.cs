namespace Api.Producers;

public abstract class AbstractEvent<T>
{
    public string Type { get; }
    public abstract T Payload { get; }

    public AbstractEvent(EventTypeName type)
    {
        Type = type.Value;
    }
}