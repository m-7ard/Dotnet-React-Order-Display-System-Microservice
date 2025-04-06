using Application.Contracts.Criteria;
using Application.Handlers.ProductHistories.List;
using Application.Interfaces.Persistence;
using Moq;

namespace Tests.UnitTests.Application.Api.ProductHistories;

public class ListProductHistoriesHandlerUnitTest
{
    private readonly Mock<IProductHistoryRepository> _mockProductHistoryRepository;
    private readonly ListProductHistoriesHandler _handler;

    public ListProductHistoriesHandlerUnitTest()
    {
        _mockProductHistoryRepository = new Mock<IProductHistoryRepository>();
        _handler = new ListProductHistoriesHandler(
            productHistoryRepository: _mockProductHistoryRepository.Object
        );
    }

    [Fact]
    public async Task ListProductHistories_NoArguments_Success()
    {
        // ARRANGE
        var query = new ListProductHistoriesQuery(
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            validTo: null,
            validFrom: null,
            productId: null,
            orderBy: null
        );

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);

        // ASSERT
        var criteria = new FilterProductHistoriesCriteria(
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            validFrom: null,
            validTo: null,
            productId: null,
            orderBy: new Tuple<string, bool>("ValidFrom", false)
        );
        Assert.True(result.IsT0);
        _mockProductHistoryRepository.Verify(repo => repo.FindAllAsync(criteria));
    }

    [Theory]
    [InlineData("newest", "ValidFrom", false)]
    [InlineData("oldest", "ValidFrom", true)]
    [InlineData("price desc", "Price", false)]
    [InlineData("price asc", "Price", true)]
    public async Task ListProductHistories_OrderByTranslation_Success(string orderBy, string expectedField, bool expectedAscending)
    {
        // ARRANGE
        var query = new ListProductHistoriesQuery(
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            validTo: null,
            validFrom: null,
            productId: null,
            orderBy: orderBy
        );

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);

        // ASSERT
        Assert.True(result.IsT0);

        var criteria = new FilterProductHistoriesCriteria(
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            validFrom: null,
            validTo: null,
            productId: null,
            orderBy: new Tuple<string, bool>(expectedField, expectedAscending)
        );
        _mockProductHistoryRepository.Verify(repo => repo.FindAllAsync(criteria));
    }
}