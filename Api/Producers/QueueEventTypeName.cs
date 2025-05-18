namespace Api.Producers;

public class QueueEventTypeName : EventTypeName
{
    private QueueEventTypeName(string value) : base(value) { }
    public static QueueEventTypeName EnsureApplicationReady => new QueueEventTypeName("ENSURE_APPLICATION_READY");
}