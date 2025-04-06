using Application.Errors;
using MediatR;
using OneOf;

namespace Application.Handlers.Orders.Read;

public class ReadOrderQuery : IRequest<OneOf<ReadOrderResult, List<ApplicationError>>>
{
    public ReadOrderQuery(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}