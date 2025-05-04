using Api.Interfaces;
using Api.Producers.Services;
using Application.Interfaces.Persistence;
using Domain.ValueObjects.Order;

namespace Api.Services;

public class OrderProducerService
{
    private readonly OrderKafkaProducer _producer;
    private readonly ILogger<OrderProducerService> _logger;
    private readonly IOrderRepository _orderRepository;
    public readonly IApiModelService _apiModelService;

    public OrderProducerService(OrderKafkaProducer producer, ILogger<OrderProducerService> logger, IOrderRepository orderRepository, IApiModelService apiModelService)
    {
        _producer = producer;
        _logger = logger;
        _orderRepository = orderRepository;
        _apiModelService = apiModelService;
    }

    public async Task PublishNewlyCreatedOrder(Guid orderId)
    {
        var order = await _orderRepository.GetByIdAsync(OrderId.ExecuteCreate(orderId));

        if (order == null)
        {
            _logger.LogError("Failed to send order event: Order of Id \"{ID}\" does not exist.", orderId);
        }
        else
        {
            var apiModel = await _apiModelService.CreateOrderApiModel(order);
            await _producer.PublishOrderCreated(apiModel);
        }
    }

    public async Task PublishUpdatedOrder(Guid orderId)
    {
        var order = await _orderRepository.GetByIdAsync(OrderId.ExecuteCreate(orderId));

        if (order == null)
        {
            _logger.LogError("Failed to send order event: Order of Id \"{ID}\" does not exist.", orderId);
        }
        else
        {
            var apiModel = await _apiModelService.CreateOrderApiModel(order);
            await _producer.PublishOrderUpdated(apiModel);
        }
    }
}