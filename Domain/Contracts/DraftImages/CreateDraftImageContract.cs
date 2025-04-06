namespace Domain.Contracts.DraftImages;

public class CreateDraftImageContract
{
    public CreateDraftImageContract(int id, string fileName, string originalFileName, string url, DateTime dateCreated)
    {
        Id = id;
        FileName = fileName;
        OriginalFileName = originalFileName;
        Url = url;
        DateCreated = dateCreated;
    }

    public int Id { get; set; }
    public string FileName { get; set; }
    public string OriginalFileName { get; set; }
    public string Url { get; set; }
    public DateTime DateCreated { get; set; }
}