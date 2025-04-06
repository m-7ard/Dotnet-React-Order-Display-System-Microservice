using Application.Errors;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Delete;

public class DeleteProductCommand : IRequest<OneOf<DeleteProductResult, List<ApplicationError>>>
{
    public DeleteProductCommand(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}