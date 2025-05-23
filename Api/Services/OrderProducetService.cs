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
    private readonly IApiModelService _apiModelService;
    private readonly TenantUserService _tenantUserService;

    public OrderProducerService(OrderKafkaProducer producer, ILogger<OrderProducerService> logger, IOrderRepository orderRepository, IApiModelService apiModelService, TenantUserService tenantUserService)
    {
        _producer = producer;
        _logger = logger;
        _orderRepository = orderRepository;
        _apiModelService = apiModelService;
        _tenantUserService = tenantUserService;
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
            await _producer.PublishOrderCreated(order: apiModel, userId: _tenantUserService.GetUserId());
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
            await _producer.PublishOrderUpdated(order: apiModel, userId: _tenantUserService.GetUserId());
        }
    }
}