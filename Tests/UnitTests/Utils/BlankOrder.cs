using Domain.DomainExtension;
using Domain.Models;

namespace Tests.UnitTests.Utils;

public static class BlankOrder
{
    public static readonly Order Instance = OrderDomainExtension.ExecuteCreateNewOrder(id: Guid.NewGuid(), 1_000_00);
}