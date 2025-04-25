using Application.Errors;
using Application.Handlers.Products.Create;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.CreateMany;

public class CreateManyProductCommand : IRequest<OneOf<CreateManyProductResult, List<ApplicationError>>>
{
    public CreateManyProductCommand(List<CreateProductCommand> commands)
    {
        Commands = commands;
    }

    public List<CreateProductCommand> Commands { get; set; }
}