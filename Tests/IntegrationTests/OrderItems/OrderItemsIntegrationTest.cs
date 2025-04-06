namespace Tests.IntegrationTests.OrderItems;

public class OrderItemsIntegrationTest : BaseIntegrationTest
{
    protected const string _route = "/api/orders";

    public override async Task InitializeAsync()
    {
        await Task.CompletedTask;
    }
}