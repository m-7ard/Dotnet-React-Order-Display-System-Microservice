using System.Text.Json;

namespace Api.Producers;

public class RawEvent
{
    public string Type { get; set; } = string.Empty;
    public JsonElement Payload { get; set; }
}