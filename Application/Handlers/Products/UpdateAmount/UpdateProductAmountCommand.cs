using Application.Errors;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.UpdateAmount;

public class UpdateProductAmountCommand : IRequest<OneOf<UpdateProductAmountResult, List<ApplicationError>>>
{
    public UpdateProductAmountCommand(Guid id, int amount)
    {
        Id = id;
        Amount = amount;
    }

    public Guid Id { get; set; }
    public int Amount { get; set; }
}