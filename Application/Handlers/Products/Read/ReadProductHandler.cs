using Application.Errors;
using Application.Errors.Objects;
using Application.Interfaces.Services;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Read;

public class ReadProductHandler : IRequestHandler<ReadProductQuery, OneOf<ReadProductResult, List<ApplicationError>>>
{
    private readonly IProductDomainService _productDomainService;

    public ReadProductHandler(IProductDomainService productDomainService)
    {
        _productDomainService = productDomainService;
    }

    public async Task<OneOf<ReadProductResult, List<ApplicationError>>> Handle(ReadProductQuery request, CancellationToken cancellationToken)
    {
        var productExists = await _productDomainService.GetProductById(request.Id);
        if (productExists.IsT1) return new ProductDoesNotExistError(message: productExists.AsT1, path: []).AsList();

        return new ReadProductResult(product: productExists.AsT0);
    }
}