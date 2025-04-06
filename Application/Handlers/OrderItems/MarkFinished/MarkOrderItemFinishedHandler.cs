using Application.Contracts.DomainService.OrderDomainService;
using Application.Errors;
using Application.Errors.Objects;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.ValueObjects.OrderItem;
using MediatR;
using OneOf;

namespace Application.Handlers.OrderItems.MarkFinished;

public class MarkOrderItemFinishedHandler : IRequestHandler<MarkOrderItemFinishedCommand, OneOf<MarkOrderItemFinishedResult, List<ApplicationError>>>
{
    private readonly IOrderDomainService _orderDomainService;
    private readonly IUnitOfWork _unitOfWork;

    public MarkOrderItemFinishedHandler(IOrderDomainService orderDomainService, IUnitOfWork unitOfWork)
    {
        _orderDomainService = orderDomainService;
        _unitOfWork = unitOfWork;
    }

    public async Task<OneOf<MarkOrderItemFinishedResult, List<ApplicationError>>> Handle(MarkOrderItemFinishedCommand request, CancellationToken cancellationToken)
    {
        var orderExists = await _orderDomainService.GetOrderById(request.OrderId);
        if (orderExists.IsT1) return new OrderDoesNotExistError(message: orderExists.AsT1, path: []).AsList();

        var order = orderExists.AsT0;

        var contract = new OrchestrateTransitionOrderItemStatusContract(order: order, orderItemId: request.OrderItemId, status: OrderItemStatus.Finished.Name, dateOccured: DateTime.UtcNow);
        var tryTransition = await _orderDomainService.TryOrchestrateTransitionOrderItemStatus(contract);
        if (tryTransition.IsT1) return new CannotTransitionOrderItemStatusError(message: tryTransition.AsT1, path: []).AsList();

        await _unitOfWork.SaveAsync();
        return new MarkOrderItemFinishedResult(orderId: request.OrderId, orderItemId: request.OrderItemId, dateFinished: contract.DateOccured);
    }
}