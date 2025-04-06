using Domain.Models;
using OneOf;

namespace Application.Interfaces.Services;

public interface IProductHistoryDomainService
{
    Task<OneOf<ProductHistory, string>> GetLatestProductHistoryForProduct(Product product);
    Task<OneOf<bool, string>> CreateInitialHistoryForProduct(Product product);
    Task<OneOf<bool, string>> ToggleNewHistoryForProduct(Product product);
    Task<OneOf<bool, string>> InvalidateHistoryForProduct(Product product);
}