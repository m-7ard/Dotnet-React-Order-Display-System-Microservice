using Application.Errors;
using Application.Errors.Objects;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.Contracts.Products;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.UpdateAmount;

public class UpdateProductAmountHandler : IRequestHandler<UpdateProductAmountCommand, OneOf<UpdateProductAmountResult, List<ApplicationError>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IProductDomainService _productDomainService;

    public UpdateProductAmountHandler(IUnitOfWork unitOfWork, IProductDomainService productDomainService)
    {
        _unitOfWork = unitOfWork;
        _productDomainService = productDomainService;
    }

    public async Task<OneOf<UpdateProductAmountResult, List<ApplicationError>>> Handle(UpdateProductAmountCommand request, CancellationToken cancellationToken)
    {
        var productExists = await _productDomainService.GetProductById(request.Id);
        if (productExists.IsT1) return new ProductDoesNotExistError(message: productExists.AsT1, path: []).AsList();

        var product = productExists.AsT0;

        // Update properties
        var contract = new UpdateProductContract(
            id: product.Id.Value,
            name: product.Name,
            price: product.Price.Value,
            description: product.Description,
            amount: request.Amount
        );

        var canUpdate = product.CanUpdate(contract);
        if (canUpdate.IsT1) return new CannotUpdateProductError(message: canUpdate.AsT1, path: []).AsList();

        product.ExecuteUpdate(contract);
        await _unitOfWork.ProductRepository.LazyUpdateAsync(product);
        await _unitOfWork.SaveAsync();

        return new UpdateProductAmountResult();
    }
}