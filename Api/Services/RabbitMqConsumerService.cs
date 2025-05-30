using System.Text;
using System.Text.Json;
using Api.Producers;
using Api.Producers.Events;
using Infrastructure.Values;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Api.Services;

public class RabbitMqConsumerService : BackgroundService
{
    private readonly ILogger<RabbitMqConsumerService> _logger;
    private IConnection? _connection;
    private IChannel? _channel;
    private readonly ConnectionFactory _factory;
    private readonly TenantDatabaseService _tenantDatabaseService;
    private readonly InitializationCoordinator _coordinator;
    private readonly SecretsStore _secretsStore;

    public RabbitMqConsumerService(ILogger<RabbitMqConsumerService> logger, TenantDatabaseService tenantDatabaseService, InitializationCoordinator coordinator, SecretsStore secretsStore)
    {
        _logger = logger;
        _factory = new ConnectionFactory();
        _tenantDatabaseService = tenantDatabaseService;
        _coordinator = coordinator;
        _secretsStore = secretsStore;
    }

    private T AssertEventPayload<T>(RawEvent rawEvent)
    {
        var ev = rawEvent.Payload.Deserialize<T>(new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true
        });

        if (ev is null)
        {
            throw new CannotDeserializeEventPayloadException(message: QueueEventTypeName.EnsureApplicationReady.Value, innerException: null);
        }

        return ev;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await _coordinator.WaitFor("SECRET_INIT");
        var rabbitMqUri = _secretsStore.GetSecret(SecretKey.RABBIT_ADDRESS);
        _factory.Uri = new Uri(rabbitMqUri);

        // https://claude.ai/chat/b6657dbd-8e5d-413d-906b-d9359b5f4bb8
        // implemenet the thing where we make a service to see if secrets has loaded
        _connection = await _factory.CreateConnectionAsync(stoppingToken);
        _channel = await _connection.CreateChannelAsync(cancellationToken: stoppingToken);

        await _channel.QueueDeclareAsync(queue: "apiQueue", durable: true, exclusive: false, autoDelete: false, arguments: null);

        var consumer = new AsyncEventingBasicConsumer(_channel);
        consumer.ReceivedAsync += async (model, ea) =>
        {
            RawEvent? rawEvent = null;
            string? message = null;

            try
            {
                var body = ea.Body.ToArray();
                message = Encoding.UTF8.GetString(body);
                rawEvent = JsonSerializer.Deserialize<RawEvent>(message, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch (Exception ex)
            {
                await _channel.BasicAckAsync(ea.DeliveryTag, false);
                _logger.LogError(ex, "Failed to deserialize message: {Message}", message);
                return;
            }


            if (rawEvent is null)
            {
                await _channel.BasicAckAsync(ea.DeliveryTag, false);
                return;
            }

            try
            {
                if (rawEvent.Type == QueueEventTypeName.EnsureApplicationReady.Value)
                {
                    var ev = AssertEventPayload<EnsureApplicationCreatedEventPayload>(rawEvent);
                    await _tenantDatabaseService.EnsureDatabaseCreatedAsync(ev.UserId);
                }
                else
                {
                    throw new Exception($"No handler exists for Event of Type {rawEvent.Type}");
                }
            }
            catch (Exception ex)
            {
                if (ex is CannotDeserializeEventPayloadException)
                {
                    _logger.LogError(ex, "Failed to deserialize event payload: {Message}", message);
                    return;
                }

                _logger.LogError(ex, "Unexpected error occured while processing event: {Message}", ex.Message);
            }
            finally
            {
                await _channel.BasicAckAsync(ea.DeliveryTag, false);
            }
        };

        await _channel.BasicConsumeAsync(queue: "apiQueue", autoAck: false, consumer: consumer, cancellationToken: stoppingToken);

        // Keep the background task running
        await Task.Delay(Timeout.Infinite, stoppingToken);
    }

    public override void Dispose()
    {
        _channel?.CloseAsync();
        _connection?.CloseAsync();

        GC.SuppressFinalize(this);

        base.Dispose();
    }
}