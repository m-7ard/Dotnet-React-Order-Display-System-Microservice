using Api.DTOs.Orders.Create;
using FluentValidation;

namespace Api.Validators;

public class CreateOrder_OrderItemValidator : AbstractValidator<CreateOrderRequestDTO.OrderItem>
{
    public CreateOrder_OrderItemValidator()
    {
        RuleFor(x => x)
            .Cascade(cascadeMode: CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("Invalid data format");

        RuleFor(x => x.ProductId)
            .NotEmpty();

        RuleFor(x => x.Quantity)
            .NotEmpty()
            .GreaterThan(0);
    }
}