using Api.ApiModels;
using Domain.Models;

namespace Api.Interfaces;

public interface IApiModelService
{
    public Task<OrderApiModel> CreateOrderApiModel(Order order);
    public Task<List<OrderApiModel>> CreateManyOrderApiModel(List<Order> orders);
}