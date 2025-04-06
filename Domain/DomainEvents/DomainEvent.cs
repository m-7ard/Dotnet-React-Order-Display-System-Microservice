namespace Domain.DomainEvents;

public abstract class DomainEvent
{
    public Guid Id { get; }
    public DateTime CreatedAt { get; }

    protected DomainEvent()
    {
        Id = Guid.NewGuid();
        CreatedAt = DateTime.UtcNow;
    }

    public abstract string EventType { get; }
}