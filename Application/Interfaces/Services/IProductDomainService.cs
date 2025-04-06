using Application.Contracts.DomainService.ProductDomainService;
using Domain.Models;
using OneOf;

namespace Application.Interfaces.Services;

public interface IProductDomainService
{
    Task<OneOf<Product, string>> GetProductById(Guid id);
    Task<OneOf<Product, string>> TryOrchestrateCreateProduct(OrchestrateCreateNewProductContract contract);
    Task<OneOf<bool, string>> TryOrchestrateAddNewProductImage(Product product, string fileName);
    Task<OneOf<bool, List<string>>> TryOrchestrateUpdateImages(Product product, List<string> fileNames);
    Task<OneOf<bool, string>> TryOrchestrateUpdateProduct(Product product, OrchestrateUpdateProductContract contract);
    Task<OneOf<bool, string>> TryOrchestrateDeleteProduct(Product product);
}