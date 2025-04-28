namespace Api.Producers;

public interface IEvent<T>
{
    ProducerEventType Type { get; }
    T Payload { get; }
}