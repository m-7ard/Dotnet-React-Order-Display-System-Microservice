using Api.ApiModels;
using Api.Services;
using Domain.Models;

namespace Api.Mappers;

public class ApiModelMapper
{
    public static ImageApiModel ProductImageToImageData(ProductImage source)
    {
        return new ImageApiModel(
            fileName: source.FileName.Value,
            originalFileName: source.OriginalFileName.Value,
            url: source.Url
        );
    }

    public static ImageApiModel DraftImageToImageData(DraftImage source)
    {
        return new ImageApiModel(
            fileName: source.FileName.Value,
            originalFileName: source.OriginalFileName.Value,
            url: source.Url
        );
    }    

    public static ProductApiModel ProductToApiModel(Product product)
    {
        return new ProductApiModel(
            id: product.Id.ToString(),
            name: product.Name,
            price: product.Price.Value,
            description: product.Description,
            dateCreated: TimeZoneService.ConvertUtcToLocalTime(product.DateCreated),
            images: product.Images.Select(ProductImageToImageData).ToList(),
            amount: product.Amount.Value
        );
    }

    public static ProductHistoryApiModel ProductHistoryToApiModel(ProductHistory productHistory)
    {
        return new ProductHistoryApiModel(
            id: productHistory.Id.ToString(),
            name: productHistory.Name,
            images: productHistory.Images,
            description: productHistory.Description,
            price: productHistory.Price.Value,
            productId: productHistory.ProductId.ToString(),
            validFrom: TimeZoneService.ConvertUtcToLocalTime(productHistory.ValidityRange.ValidFrom),
            validTo: productHistory.ValidityRange.ValidTo is null ? null : TimeZoneService.ConvertUtcToLocalTime(productHistory.ValidityRange.ValidTo.Value)
        );
    }

    public static OrderItemApiModel OrderItemToApiModel(Order order, OrderItem orderItem, ProductHistory productHistory)
    {
        return new OrderItemApiModel(
            id: orderItem.Id.ToString(),
            quantity: orderItem.Quantity.Value,
            status: orderItem.Schedule.Status.Name,
            dateCreated: TimeZoneService.ConvertUtcToLocalTime(orderItem.Schedule.Dates.DateCreated),
            dateFinished: orderItem.Schedule.Dates.DateFinished is null ? null : TimeZoneService.ConvertUtcToLocalTime(orderItem.Schedule.Dates.DateFinished.Value),
            orderId: order.Id.Value.ToString(),
            productHistory: ProductHistoryToApiModel(productHistory),
            serialNumber: orderItem.SerialNumber
        );
    }

    public static OrderApiModel OrderToApiModel(Order order, List<OrderItemApiModel> orderItems)
    {
        return new OrderApiModel(
            id: order.Id.Value.ToString(),
            total: order.Total.Value,
            dateCreated: TimeZoneService.ConvertUtcToLocalTime(order.OrderSchedule.Dates.DateCreated),
            dateFinished: order.OrderSchedule.Dates.DateFinished is null ? null : TimeZoneService.ConvertUtcToLocalTime(order.OrderSchedule.Dates.DateFinished.Value),
            orderItems: orderItems,
            status: order.OrderSchedule.Status.Name,
            serialNumber: order.SerialNumber
        );
    }
}