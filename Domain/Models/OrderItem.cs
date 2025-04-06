using Domain.Contracts.OrderItems;
using Domain.ValueObjects.OrderItem;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductHistory;
using OneOf;

namespace Domain.Models;
public class OrderItem
{
    public OrderItem(OrderItemId id, int serialNumber, OrderItemQuantity quantity, OrderItemSchedule schedule, ProductId productId, ProductHistoryId productHistoryId)
    {
        Id = id;
        SerialNumber = serialNumber;
        Quantity = quantity;
        Schedule = schedule;
        ProductId = productId;
        ProductHistoryId = productHistoryId;
    }

    public OrderItemId Id { get; private set; }
    public int SerialNumber { get; private set; }
    public OrderItemQuantity Quantity { get; set; }
    public OrderItemSchedule Schedule { get; set; }
    public ProductId ProductId { get; set; }
    public ProductHistoryId ProductHistoryId { get; set; }

    private readonly Dictionary<OrderItemStatus, List<OrderItemStatus>> _validStatusStatusTransitions = new()
    {
        { OrderItemStatus.Pending, [OrderItemStatus.Finished] },
        { OrderItemStatus.Finished, [] },
    };

    public OneOf<bool, string> CanTransitionStatus(TransitionOrderItemStatusContract contract)
    {
        // OrderItemStatus
        var canCreateStatus = OrderItemStatus.CanCreate(contract.Status);
        if (canCreateStatus.IsT1) return canCreateStatus.AsT1;

        var newStatus = OrderItemStatus.ExecuteCreate(contract.Status);

        var currentStatus = Schedule.Status;
        if (!_validStatusStatusTransitions.TryGetValue(currentStatus, out var transitionList)) return $"No transitions exist for status \"{currentStatus}\".";

        var transitionExists = transitionList.Exists(status => status == newStatus); 
        if (!transitionExists) return $"Invalid status transition from {currentStatus} to {newStatus}.";


        // OrderItemDates
        var canCreateDates = OrderItemDates.CanCreate(dateCreated: contract.DateCreated, dateFinished: contract.DateFinished);
        if (canCreateDates.IsT1) return canCreateDates.AsT1;

        var newOrderDates = OrderItemDates.ExecuteCreate(dateCreated: contract.DateCreated, dateFinished: contract.DateFinished); 


        // OrderItemSchedule
        var canCreateSchedule = OrderItemSchedule.CanCreate(newStatus, newOrderDates);
        if (canCreateSchedule.IsT1) return canCreateSchedule.AsT1;


        return true;
    }

    public void ExecuteTransitionStatus(TransitionOrderItemStatusContract contract)
    {
        var canTransitionStatus = CanTransitionStatus(contract);
        if (canTransitionStatus.IsT1)
        {
            throw new Exception(canTransitionStatus.AsT1);
        }

        var newStatus = OrderItemStatus.ExecuteCreate(contract.Status);
        var newOrderDates = OrderItemDates.ExecuteCreate(dateCreated: contract.DateCreated, dateFinished: contract.DateFinished); 
        var newSchedule = OrderItemSchedule.ExecuteCreate(newStatus, newOrderDates);
        Schedule = newSchedule;
    }

    public static OneOf<bool, string> CanCreate(CreateOrderItemContract contract)
    {
        var canCreateOrderItemId = OrderItemId.CanCreate(contract.Id);
        if (canCreateOrderItemId.IsT1) return canCreateOrderItemId.AsT1;

        var canCreateQuantity = OrderItemQuantity.CanCreate(contract.Quantity);
        if (canCreateQuantity.IsT1) return canCreateQuantity.AsT1;

        var canCreateStatus = OrderItemStatus.CanCreate(contract.Status);
        if (canCreateStatus.IsT1) return canCreateStatus.AsT1;

        var canCreateDates = OrderItemDates.CanCreate(dateCreated: contract.DateCreated, dateFinished: contract.DateFinished);
        if (canCreateDates.IsT1) return canCreateDates.AsT1;
       
        // Relationships
        var status = OrderItemStatus.ExecuteCreate(contract.Status);
        var dates = OrderItemDates.ExecuteCreate(dateCreated: contract.DateCreated, dateFinished: contract.DateFinished);
        var canCreateSchedule = OrderItemSchedule.CanCreate(status: status, dates: dates);
        if (canCreateSchedule.IsT1) return canCreateSchedule.AsT1;

        return true;
    }

    public static OrderItem ExecuteCreate(CreateOrderItemContract contract)
    {
        var canCreateResult = CanCreate(contract);
        if (canCreateResult.TryPickT1(out var error, out _))
        {
            throw new Exception(error);
        }

        var id = OrderItemId.ExecuteCreate(contract.Id);
        var quantity = OrderItemQuantity.ExecuteCreate(contract.Quantity);
        var status = OrderItemStatus.ExecuteCreate(contract.Status);
        var dates = OrderItemDates.ExecuteCreate(dateCreated: contract.DateCreated, dateFinished: contract.DateFinished);
        var schedule = OrderItemSchedule.ExecuteCreate(status: status, dates: dates);

        return new OrderItem(
            id: id, 
            quantity: quantity,
            schedule: schedule,
            productHistoryId: contract.ProductHistoryId,
            productId: contract.ProductId,
            serialNumber: contract.SerialNumber
        );
    }

}