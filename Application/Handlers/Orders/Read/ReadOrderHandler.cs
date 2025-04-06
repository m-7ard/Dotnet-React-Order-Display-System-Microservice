using Application.Errors;
using Application.Errors.Objects;
using Application.Interfaces.Services;
using MediatR;
using OneOf;

namespace Application.Handlers.Orders.Read;

public class ReadOrderHandler : IRequestHandler<ReadOrderQuery, OneOf<ReadOrderResult, List<ApplicationError>>>
{
    private readonly IOrderDomainService _orderDomainService;

    public ReadOrderHandler(IOrderDomainService orderDomainService)
    {
        _orderDomainService = orderDomainService;
    }

    public async Task<OneOf<ReadOrderResult, List<ApplicationError>>> Handle(ReadOrderQuery request, CancellationToken cancellationToken)
    {
        var orderExists = await _orderDomainService.GetOrderById(request.Id);
        if (orderExists.IsT1) return new OrderDoesNotExistError(message: orderExists.AsT1, path: []).AsList();

        var order = orderExists.AsT0;

        var result = new ReadOrderResult(order: order);
        return result;
    }
}