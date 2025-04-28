namespace Api.Producers;

public abstract class AbstractEvent<T>
{
    public string Type { get; }
    public abstract T Payload { get; }

    protected AbstractEvent(ProducerEventType type)
    {
        Type = type.Value;
    }
}