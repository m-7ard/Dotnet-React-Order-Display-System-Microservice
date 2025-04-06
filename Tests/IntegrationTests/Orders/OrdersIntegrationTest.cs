namespace Tests.IntegrationTests.Orders;

public class OrdersIntegrationTest : BaseIntegrationTest
{
    protected const string _route = "/api/orders";

    public override async Task InitializeAsync()
    {
        await Task.CompletedTask;
    }
}