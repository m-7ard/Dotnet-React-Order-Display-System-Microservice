using Application.Contracts.DomainService.OrderDomainService;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.Contracts.Orders;
using Domain.DomainExtension;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.OrderItem;
using OneOf;

namespace Application.DomainService;

public class OrderDomainService : IOrderDomainService
{
    private readonly IProductDomainService _productDomainService;
    private readonly IOrderRepository _orderRepository;
    private readonly IProductHistoryDomainService _productHistoryDomainService;
    private readonly ISequenceService _sequenceService;
    private readonly IProductRepository _productRepository;

    public OrderDomainService(IProductDomainService productDomainService, IProductHistoryDomainService productHistoryDomainService, ISequenceService sequenceService, IProductRepository productRepository, IOrderRepository orderRepository)
    {
        _productDomainService = productDomainService;
        _productHistoryDomainService = productHistoryDomainService;
        _sequenceService = sequenceService;
        _productRepository = productRepository;
        _orderRepository = orderRepository;
    }

    public async Task<OneOf<Order, string>> TryOrchestrateCreateNewOrder(Guid id)
    {
        var serialNumber = await _sequenceService.GetNextOrderValueAsync();
        var canCreateOrder = OrderDomainExtension.CanCreateNewOrder(id: id, serialNumber: serialNumber);
        if (canCreateOrder.IsT1) return canCreateOrder.AsT1;

        var order = OrderDomainExtension.ExecuteCreateNewOrder(id: id, serialNumber: serialNumber);

        await _orderRepository.LazyCreateAsync(order);
        
        return order;
    }

    public async Task<OneOf<bool, string>> TryOrchestrateAddNewOrderItem(OrchestrateAddNewOrderItemContract contract)
    {
        var order = contract.Order;
        var productId = contract.ProductId;
        var quantity = contract.Quantity;

        // Product Exists
        var productExistsResult = await _productDomainService.GetProductById(productId);
        if (productExistsResult.IsT1) return productExistsResult.AsT1;
        
        var product = productExistsResult.AsT0;

        // Product History Exists
        var latestProductHistoryExistsResult = await _productHistoryDomainService.GetLatestProductHistoryForProduct(product);
        if (latestProductHistoryExistsResult.IsT1) return latestProductHistoryExistsResult.AsT1;

        var productHistory = latestProductHistoryExistsResult.AsT0;

        // Lower Product Amount
        var canLowerAmount = product.CanLowerAmount(quantity);
        if (canLowerAmount.IsT1) return $"Order Item quantity ({quantity}) cannot be larger than Product amount ({product.Amount})";

        product.ExecuteLowerAmount(quantity);

        // Check if Product History is valid
        if (!productHistory.IsValid()) return $"Product History for Product of Id \"{product.Id}\" is not valid.";

        // Add Order Item
        var addNewOrderItemContract = new AddNewOrderItemContract(
            order: order,
            id: Guid.NewGuid(),
            serialNumber: await _sequenceService.GetNextOrderItemValueAsync(),
            quantity: quantity,
            productId: product.Id,
            productHistoryId: productHistory.Id,
            total: product.Price.Value * quantity
        );
        
        var canAddOrderItem = OrderDomainExtension.CanAddNewOrderItem(addNewOrderItemContract);
        if (canAddOrderItem.IsT1) return canAddOrderItem.AsT1;

        OrderDomainExtension.ExecuteAddNewOrderItem(addNewOrderItemContract);
        
        // Update Order
        await _orderRepository.LazyUpdateAsync(order);

        // Update Product
        await _productRepository.LazyUpdateAsync(product);
        
        return true;
    }

    public async Task<OneOf<Order, string>> GetOrderById(Guid id)
    {
        var orderId = OrderId.ExecuteCreate(id);
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order is null) return $"Order of Id \"{orderId}\" does not exist.";

        return order;
    }

    public async Task<OneOf<bool, string>> TryOrchestrateTransitionOrderStatus(OrchestrateTransitionOrderStatusContract contract)
    {
        var order = contract.Order;
        var status = contract.Status;
        var dateOccured = contract.DateOccured;

        var canCreateStatus = OrderStatus.CanCreate(status);
        if (canCreateStatus.IsT1) return canCreateStatus.AsT1;

        var orderStatus = OrderStatus.ExecuteCreate(status);

        if (orderStatus == OrderStatus.Finished)
        {
            var canMarkFinished = OrderDomainExtension.CanMarkFinished(order, dateOccured);
            if (canMarkFinished.IsT1) return canMarkFinished.AsT1;

            OrderDomainExtension.ExecuteMarkFinished(order, dateOccured);
        }
        else
        {
            throw new Exception($"No transition for OrderStatus of value \"{orderStatus}\" has been provided.");
        }

        await _orderRepository.LazyUpdateAsync(order);
        return true;
    }

    public async Task<OneOf<bool, string>> TryOrchestrateTransitionOrderItemStatus(OrchestrateTransitionOrderItemStatusContract contract)
    {
        var status = contract.Status;
        var order = contract.Order;
        var orderItemId = contract.OrderItemId;
        var dateOccured = contract.DateOccured;

        var canCreateStatus = OrderItemStatus.CanCreate(status);
        if (canCreateStatus.IsT1) return canCreateStatus.AsT1;

        var orderItemStatus = OrderItemStatus.ExecuteCreate(status);

        if (orderItemStatus == OrderItemStatus.Finished)
        {
            var canMarkFinished = OrderDomainExtension.CanMarkOrderItemFinished(order, orderItemId, dateOccured);
            if (canMarkFinished.IsT1) return canMarkFinished.AsT1;

            OrderDomainExtension.ExecuteMarkOrderItemFinished(order, orderItemId, dateOccured);
        }
        else
        {
            throw new Exception($"No transition for OrderItemStatus of value \"{orderItemStatus}\" has been provided.");
        }

        await _orderRepository.LazyUpdateAsync(order);
        return true;
    }
}