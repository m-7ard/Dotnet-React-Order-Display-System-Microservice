using Application.Contracts.Criteria;
using Application.Handlers.Orders.List;
using Application.Interfaces.Persistence;
using Moq;

namespace Tests.UnitTests.Application.Api.Orders;

public class ListOrdersHandlerUnitTest
{
    private readonly Mock<IOrderRepository> _mockOrderRepository;
    private readonly ListOrdersHandler _handler;
    private readonly ListOrdersQuery _query;

    public ListOrdersHandlerUnitTest()
    {
        _mockOrderRepository = new Mock<IOrderRepository>();
        _handler = new ListOrdersHandler(
            orderRepository: _mockOrderRepository.Object
        );
        _query = new ListOrdersQuery(
            minTotal: null,
            maxTotal: null,
            status: null,
            createdBefore: null,
            createdAfter: null,
            id: null,
            productId: null,
            productHistoryId: null,
            orderBy: null,
            orderSerialNumber: null,
            orderItemSerialNumber: null
        );
    }

    [Fact]
    public async Task ListOrders_NoArgs_Success()
    {
        // ARRANGE
        var query = _query;

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);

        // ASSERT
        var criteria = new FilterOrdersCriteria(
            minTotal: null,
            maxTotal: null,
            status: null,
            createdBefore: null,
            createdAfter: null,
            productId: null,
            id: null,
            productHistoryId: null,
            orderBy: new Tuple<string, bool>("DateCreated", false),
            orderSerialNumber: null,
            orderItemSerialNumber: null
        );
        Assert.True(result.IsT0);
        _mockOrderRepository.Verify(
            repo => repo.FilterAllAsync(criteria)
        );
    }

    [Theory]
    [InlineData("newest", "DateCreated", false)]
    [InlineData("oldest", "DateCreated", true)]
    [InlineData("total desc", "Total", false)]
    [InlineData("total asc", "Total", true)]
    public async Task ListOrders_OrderByTranslation_Success(string orderBy, string expectedField, bool expectedAscending)
    {
        // ARRANGE
        _query.OrderBy = orderBy;

        // ACT
        var result = await _handler.Handle(_query, CancellationToken.None);
        
        // ASSERT
        var criteria = new FilterOrdersCriteria(
            minTotal: null,
            maxTotal: null,
            status: null,
            createdBefore: null,
            createdAfter: null,
            productId: null,
            id: null,
            productHistoryId: null,
            orderBy: new Tuple<string, bool>(expectedField, expectedAscending),
            orderSerialNumber: null,
            orderItemSerialNumber: null
        );
        Assert.True(result.IsT0);
        _mockOrderRepository.Verify(
            repo => repo.FilterAllAsync(criteria)
        );
    }
}