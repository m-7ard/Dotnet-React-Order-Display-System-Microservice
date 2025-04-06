using Api.DTOs.Products.Update;
using FluentValidation;

namespace Api.Validators;

public class UpdateProductValidator : AbstractValidator<UpdateProductRequestDTO>
{
    public UpdateProductValidator()
    {
        RuleFor(x => x)
            .NotNull()
            .WithMessage("Invalid data format");

        RuleFor(x => x.Name)
            .NotEmpty()
            .MinimumLength(1)
            .MaximumLength(1028);

        RuleFor(x => x.Price)
            .GreaterThan(0)
            .Custom((value, context) =>
            {
                var asString = value.ToString();
                if (!asString.Contains('.') || asString.Split('.')[1].Length <= 2)
                {
                    return;
                }

                context.AddFailure("Price cannot have more than 2 decimal places.");
            });

        RuleFor(x => x.Description)
            .MaximumLength(1028);
    }
}