using Application.Contracts.DomainService.ProductDomainService;
using Application.Errors;
using Application.Errors.Objects;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.ValueObjects.Product;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.CreateMany;

public class CreateManyProductHandler : IRequestHandler<CreateManyProductCommand, OneOf<CreateManyProductResult, List<ApplicationError>>>
{
    private readonly IProductDomainService _productDomainService;
    private readonly IProductHistoryDomainService _productHistoryDomainService;
    private readonly IUnitOfWork _unitOfWork;

    public CreateManyProductHandler(IProductDomainService productDomainService, IUnitOfWork unitOfWork, IProductHistoryDomainService productHistoryDomainService)
    {
        _productDomainService = productDomainService;
        _unitOfWork = unitOfWork;
        _productHistoryDomainService = productHistoryDomainService;
    }

    public async Task<OneOf<CreateManyProductResult, List<ApplicationError>>> Handle(CreateManyProductCommand request, CancellationToken cancellationToken)
    {
        var errors = new List<ApplicationError>();
        var ids = new List<ProductId>();

        foreach (var command in request.Commands)
        {
            var contract = new OrchestrateCreateNewProductContract(
                id: Guid.NewGuid(),
                name: command.Name,
                price: command.Price,
                description: command.Description,
                amount: command.Amount
            );

            var tryOrchestrateCreateProduct = await _productDomainService.TryOrchestrateCreateProduct(contract);

            if (tryOrchestrateCreateProduct.IsT1)
            {
                return new CannotCreateProductError(message: tryOrchestrateCreateProduct.AsT1, path: []).AsList();
            }

            var product = tryOrchestrateCreateProduct.AsT0;
            
            var imageErrors = new List<ApplicationError>();

            foreach (var fileName in command.Images)
            {
                var tryOrchestrateAddNewProductImage = await _productDomainService.TryOrchestrateAddNewProductImage(product: product, fileName: fileName);
                if (tryOrchestrateAddNewProductImage.IsT1)
                {
                    imageErrors.Add(new CannotAddProductImageError(message: tryOrchestrateAddNewProductImage.AsT1, path: [fileName]));
                }
            }

            if (imageErrors.Count > 0)
            {
                errors.Concat(imageErrors);
                continue;
            }

            var canCreate = await _productHistoryDomainService.CreateInitialHistoryForProduct(product);
            if (canCreate.IsT1)
            {
                errors.Add(new CannotCreateInitialProductHistoryError(message: canCreate.AsT1, path: []));
                continue;
            }

            ids.Add(product.Id);
        }

        if (errors.Count > 0)
        {
            return errors;
        }

        await _unitOfWork.SaveAsync();
        return new CreateManyProductResult(ids: ids);
    }
}