using Application.Contracts.DomainService.OrderDomainService;
using Application.Errors;
using Application.Errors.Objects;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using MediatR;
using OneOf;

namespace Application.Handlers.Orders.Create;

public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, OneOf<CreateOrderResult, List<ApplicationError>>>
{
    private readonly IOrderDomainService _orderDomainService;
    private readonly IUnitOfWork _unitOfWork;

    public CreateOrderHandler(IOrderDomainService orderDomainService, IUnitOfWork unitOfWork)
    {
        _orderDomainService = orderDomainService;
        _unitOfWork = unitOfWork;
    }

    public async Task<OneOf<CreateOrderResult, List<ApplicationError>>> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        // Create New Order 
        var tryCreateOrder = await _orderDomainService.TryOrchestrateCreateNewOrder(request.Id);
        if (tryCreateOrder.IsT1) {
            return new CannotCreateOrderError(message: tryCreateOrder.AsT1, path: []).AsList();
        }
        
        var order = tryCreateOrder.AsT0;

        // Create Order Items
        var validationErrors = new List<ApplicationError>();

        foreach (var (uid, orderItem) in request.OrderItemData)
        {
            var tryAddOrderItem = await _orderDomainService.TryOrchestrateAddNewOrderItem(new OrchestrateAddNewOrderItemContract(order: order, productId: orderItem.ProductId, quantity: orderItem.Quantity));
            if (tryAddOrderItem.IsT1)
            {
                validationErrors.Add(new CannotCreateOrderItemError(message: tryAddOrderItem.AsT1, path: [uid]));
            }
        }

        if (validationErrors.Count > 0)
        {
            return validationErrors;
        }

        await _unitOfWork.SaveAsync();

        return new CreateOrderResult();
    }
}