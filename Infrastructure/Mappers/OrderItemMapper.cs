using Domain.Contracts.OrderItems;
using Domain.Models;
using Domain.ValueObjects.OrderItem;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductHistory;
using Infrastructure.DbEntities;

namespace Infrastructure.Mappers;

public static class OrderItemMapper
{
    public static OrderItem ToDomain(OrderItemDbEntity source)
    {
        var contract = new CreateOrderItemContract(
            id: source.Id,
            quantity: source.Quantity,
            status: source.Status.ToString(),
            dateCreated: source.DateCreated,
            dateFinished: source.DateFinished,
            productHistoryId: ProductHistoryId.ExecuteCreate(source.ProductHistoryId),
            productId: ProductId.ExecuteCreate(source.ProductId),
            serialNumber: source.SerialNumber
        );

        return OrderItem.ExecuteCreate(contract);
    }

    public static OrderItemDbEntity ToDbModel(Order order, OrderItem source)
    {
        return new OrderItemDbEntity(
            id: source.Id.Value,
            quantity: source.Quantity.Value,
            status: ToDbEntityStatus(source.Schedule.Status),
            dateCreated: source.Schedule.Dates.DateCreated,
            dateFinished: source.Schedule.Dates.DateFinished,
            orderId: order.Id.Value,
            productHistoryId: source.ProductHistoryId.Value,
            productId: source.ProductId.Value,
            serialNumber: source.SerialNumber
        );
    }

    public static OrderItemDbEntity.Statuses ToDbEntityStatus(OrderItemStatus status)
    {
        return (OrderItemDbEntity.Statuses)Enum.Parse(typeof(OrderItemDbEntity.Statuses), status.Name);
    }
}