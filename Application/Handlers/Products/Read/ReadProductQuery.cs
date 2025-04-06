using Application.Errors;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Read;

public class ReadProductQuery : IRequest<OneOf<ReadProductResult, List<ApplicationError>>>
{
    public ReadProductQuery(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}