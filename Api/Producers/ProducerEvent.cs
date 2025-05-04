namespace Api.Producers;

public class ProducerEvent
{
    public string Type { get; set; }
    public object Payload { get; set; }

    public ProducerEvent(ProducerEventType type, object payload)
    {
        Type = type.Value;
        Payload = payload;
    }
}