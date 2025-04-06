using Application.Errors;
using MediatR;
using OneOf;

namespace Application.Handlers.OrderItems.MarkFinished;

public class MarkOrderItemFinishedCommand : IRequest<OneOf<MarkOrderItemFinishedResult, List<ApplicationError>>>
{
    public MarkOrderItemFinishedCommand(Guid orderId, Guid orderItemId)
    {
        OrderId = orderId;
        OrderItemId = orderItemId;
    }

    public Guid OrderId { get; set; }
    public Guid OrderItemId { get; set; }
}