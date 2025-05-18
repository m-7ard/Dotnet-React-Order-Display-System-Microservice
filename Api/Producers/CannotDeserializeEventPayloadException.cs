namespace Api.Producers;

public class CannotDeserializeEventPayloadException : Exception
{
    public CannotDeserializeEventPayloadException()
    {
    }

    public CannotDeserializeEventPayloadException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}