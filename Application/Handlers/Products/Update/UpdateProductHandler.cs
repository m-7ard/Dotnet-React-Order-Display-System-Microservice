using Application.Contracts.DomainService.ProductDomainService;
using Application.Errors;
using Application.Errors.Objects;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Update;

public class UpdateProductHandler : IRequestHandler<UpdateProductCommand, OneOf<UpdateProductResult, List<ApplicationError>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IProductDomainService _productDomainService;
    private readonly IProductHistoryDomainService _productHistoryDomainService;

    public UpdateProductHandler(IUnitOfWork unitOfWork, IProductDomainService productDomainService, IProductHistoryDomainService productHistoryDomainService)
    {
        _unitOfWork = unitOfWork;
        _productDomainService = productDomainService;
        _productHistoryDomainService = productHistoryDomainService;
    }

    public async Task<OneOf<UpdateProductResult, List<ApplicationError>>> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var productExists = await _productDomainService.GetProductById(request.Id);
        if (productExists.IsT1)
        {
            return new ProductDoesNotExistError(message: productExists.AsT1, path: []).AsList();
        }

        var product = productExists.AsT0;

        var contract = new OrchestrateUpdateProductContract(
            id: request.Id,
            name: request.Name,
            price: request.Price,
            description: request.Description
        );

        var tryOrchestrateUpdateImages = await _productDomainService.TryOrchestrateUpdateImages(product: product, fileNames: request.Images);
        if (tryOrchestrateUpdateImages.IsT1)
        {
            return tryOrchestrateUpdateImages.AsT1
                .Select(message => new CannotUpdateProductImagesError(message: message, path: []))
                .Cast<ApplicationError>()
                .ToList();
        }

        var tryOrchestrateUpdateProduct = await _productDomainService.TryOrchestrateUpdateProduct(product, contract);
        if (tryOrchestrateUpdateProduct.IsT1) return new CannotUpdateProductError(message: tryOrchestrateUpdateProduct.AsT1, path: []).AsList();

        var canToggle = await _productHistoryDomainService.ToggleNewHistoryForProduct(product);
        if (canToggle.IsT1) return new CannotToggleNewProductHistoryError(message: canToggle.AsT1, path: []).AsList();

        await _unitOfWork.SaveAsync();

        return new UpdateProductResult();
    }
}