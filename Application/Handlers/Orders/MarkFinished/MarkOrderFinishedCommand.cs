using Application.Errors;
using MediatR;
using OneOf;

namespace Application.Handlers.Orders.MarkFinished;

public class MarkOrderFinishedCommand : IRequest<OneOf<MarkOrderFinishedResult, List<ApplicationError>>>
{
    public MarkOrderFinishedCommand(Guid orderId)
    {
        OrderId = orderId;
    }

    public Guid OrderId { get; set; }
}