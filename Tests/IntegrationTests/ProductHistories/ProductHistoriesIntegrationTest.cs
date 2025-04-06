namespace Tests.IntegrationTests.ProductHistories;

public class ProductHistoriesIntegrationTest : BaseIntegrationTest
{
    protected const string _route = "/api/product_histories";

    public override async Task InitializeAsync()
    {
        await Task.CompletedTask;
    }
}