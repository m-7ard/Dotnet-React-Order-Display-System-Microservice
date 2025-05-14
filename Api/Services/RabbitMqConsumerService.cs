using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Api.Services;

public class RabbitMqConsumerService : BackgroundService
{
    private readonly ILogger<RabbitMqConsumerService> _logger;
    private IConnection? _connection;
    private IChannel? _channel;
    private readonly ConnectionFactory _factory;

    public RabbitMqConsumerService(ILogger<RabbitMqConsumerService> logger)
    {
        _logger = logger;

        _factory = new ConnectionFactory
        {
            Uri = new Uri("amqp://guest:guest@localhost:5672/")
        };
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _connection = await _factory.CreateConnectionAsync(stoppingToken);
        _channel = await _connection.CreateChannelAsync(cancellationToken: stoppingToken);

        await _channel.QueueDeclareAsync(queue: "apiQueue", durable: true, exclusive: false, autoDelete: false, arguments: null);

        var consumer = new AsyncEventingBasicConsumer(_channel);
        consumer.ReceivedAsync += async (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            _logger.LogInformation("Received: {Message}", message);

            // Process the message
            await Task.Yield();

            await _channel.BasicAckAsync(ea.DeliveryTag, false);
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