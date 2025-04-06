using Api.ApiModels;
using Api.Interfaces;
using Api.Mappers;
using Application.Interfaces.Persistence;
using Domain.Models;
using Domain.ValueObjects.ProductHistory;

namespace Api.Services;

public class ApiModelService : IApiModelService
{
    private readonly Dictionary<ProductHistoryId, ProductHistory?> ProductHistoryCache = new Dictionary<ProductHistoryId, ProductHistory?>();
    private readonly IProductHistoryRepository _productHistoryRepository;

    public ApiModelService(IProductHistoryRepository productHistoryRepository)
    {
        _productHistoryRepository = productHistoryRepository;
    }


    private async Task<ProductHistory?> GetProductHistoryFromCacheOrDb(ProductHistoryId id) 
    {
        if (ProductHistoryCache.TryGetValue(id, out var cachedProductHistory))
        {
            return cachedProductHistory;
        } 

        var productHistory = await _productHistoryRepository.GetByIdAsync(id);
        ProductHistoryCache[id] = productHistory;
        return productHistory;
    }

    public async Task<OrderApiModel> CreateOrderApiModel(Order order)
    {
        var orderItems = new List<OrderItemApiModel>();

        foreach (var orderItem in order.OrderItems)
        {
            var productHistory = await GetProductHistoryFromCacheOrDb(orderItem.ProductHistoryId);
            if (productHistory == null)
            {
                throw new Exception($"ProductHistory of Id \"{orderItem.ProductHistoryId}\" from OrderItem of Id \"${orderItem.Id}\"");
            }

            orderItems.Add(ApiModelMapper.OrderItemToApiModel(order, orderItem, productHistory));
        }
        
        return ApiModelMapper.OrderToApiModel(order, orderItems);
    }

    public async Task<List<OrderApiModel>> CreateManyOrderApiModel(List<Order> orders)
    {
        var orderApiModels = new List<OrderApiModel>();
        
        foreach (var order in orders)
        {
            orderApiModels.Add(await CreateOrderApiModel(order));
        }

        return orderApiModels;
    }
}