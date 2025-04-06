namespace Tests.IntegrationTests.Products;

public class ProductsIntegrationTest : BaseIntegrationTest
{
    protected const string _route = "/api/products";

    public override async Task InitializeAsync()
    {
        await Task.CompletedTask;
    }
}