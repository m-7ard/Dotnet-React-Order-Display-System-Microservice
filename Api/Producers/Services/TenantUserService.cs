namespace Api.Producers.Services;

public class TenantUserService
{
    public string? UserId { private get; set; }

    public string GetUserId()
    {
        if (UserId is null) throw new Exception("GetUserId was called while tenant UserId is null.");
        return UserId;
    }
}