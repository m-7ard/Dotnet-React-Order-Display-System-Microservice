using Application.Contracts.Criteria;
using Application.Errors;
using Application.Interfaces.Persistence;
using Domain.ValueObjects.Order;
using MediatR;
using OneOf;

namespace Application.Handlers.Orders.List;

public class ListOrdersHandler : IRequestHandler<ListOrdersQuery, OneOf<ListOrdersResult, List<ApplicationError>>>
{
    private readonly IOrderRepository _orderRepository;

    public ListOrdersHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OneOf<ListOrdersResult, List<ApplicationError>>> Handle(ListOrdersQuery request, CancellationToken cancellationToken)
    {
        Tuple<string, bool>? orderBy = new Tuple<string, bool>("DateCreated", false);
        if (request.OrderBy == "newest")
        {
            orderBy = new Tuple<string, bool>("DateCreated", false);
        }
        else if (request.OrderBy == "oldest")
        {
            orderBy = new Tuple<string, bool>("DateCreated", true);
        }
        else if (request.OrderBy == "total desc")
        {
            orderBy = new Tuple<string, bool>("Total", false);
        }
        else if (request.OrderBy == "total asc")
        {
            orderBy = new Tuple<string, bool>("Total", true);
        }

        var criteria = new FilterOrdersCriteria(
            minTotal: request.MinTotal,
            maxTotal: request.MaxTotal,
            status: null,
            createdBefore: request.CreatedBefore,
            createdAfter: request.CreatedAfter,
            id: request.Id,
            productId: request.ProductId,
            productHistoryId: request.ProductHistoryId,
            orderBy: orderBy,
            orderSerialNumber: request.OrderSerialNumber,
            orderItemSerialNumber: request.OrderItemSerialNumber
        );

        if (request.Status is not null)
        {
            var canCreateOrderStatusResult = OrderStatus.CanCreate(request.Status);
            if (canCreateOrderStatusResult.IsT0)
            {
                criteria.Status = OrderStatus.ExecuteCreate(request.Status);
            }
        }

        var orders = await _orderRepository.FilterAllAsync(criteria);
        var result = new ListOrdersResult(orders: orders);
        return result;
    }
}