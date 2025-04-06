using Application.Contracts.DomainService.OrderDomainService;
using Application.Errors;
using Application.Errors.Objects;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.Contracts.Orders;
using Domain.ValueObjects.Order;
using MediatR;
using OneOf;

namespace Application.Handlers.Orders.MarkFinished;

public class MarkOrderFinishedHandler : IRequestHandler<MarkOrderFinishedCommand, OneOf<MarkOrderFinishedResult, List<ApplicationError>>>
{
    private readonly IOrderDomainService _orderDomainService;
    private readonly IUnitOfWork _unitOfWork;

    public MarkOrderFinishedHandler(IOrderDomainService orderDomainService, IUnitOfWork unitOfWork)
    {
        _orderDomainService = orderDomainService;
        _unitOfWork = unitOfWork;
    }

    public async Task<OneOf<MarkOrderFinishedResult, List<ApplicationError>>> Handle(MarkOrderFinishedCommand request, CancellationToken cancellationToken)
    {
        var orderExists = await _orderDomainService.GetOrderById(request.OrderId);
        if (orderExists.IsT1) return new OrderDoesNotExistError(message: orderExists.AsT1, path: []).AsList();

        var order = orderExists.AsT0;

        var dateFinished = DateTime.UtcNow;
        var contract = new OrchestrateTransitionOrderStatusContract(order, OrderStatus.Finished.Name, dateFinished);
        var tryTransition = await _orderDomainService.TryOrchestrateTransitionOrderStatus(contract);
        if (tryTransition.IsT1) return new CannotTransitionOrderStatusError(message: tryTransition.AsT1, path: []).AsList();

        await _unitOfWork.SaveAsync();
        return new MarkOrderFinishedResult(orderId: request.OrderId, dateFinished: dateFinished);
    }
}