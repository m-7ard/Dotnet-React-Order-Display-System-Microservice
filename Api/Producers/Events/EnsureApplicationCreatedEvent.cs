namespace Api.Producers.Events;

public class EnsureApplicationCreatedEventPayload
{
    public string UserId { get; set; }

    public EnsureApplicationCreatedEventPayload(string userId)
    {
        UserId = userId;
    }
}

public class EnsureApplicationCreatedEvent : AbstractEvent<EnsureApplicationCreatedEventPayload>
{
    public override EnsureApplicationCreatedEventPayload Payload { get; }

    public EnsureApplicationCreatedEvent(EnsureApplicationCreatedEventPayload payload) : base(QueueEventTypeName.EnsureApplicationReady)
    {
        Payload = payload;
    }
}