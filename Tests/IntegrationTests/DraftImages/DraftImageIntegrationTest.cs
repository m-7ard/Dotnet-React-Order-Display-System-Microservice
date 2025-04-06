namespace Tests.IntegrationTests.DraftImages;

public class DraftImageIntegrationTest : BaseIntegrationTest
{
    protected const string _route = "/api/draft_images";

    public override async Task InitializeAsync()
    {
        await Task.CompletedTask;
    }
}