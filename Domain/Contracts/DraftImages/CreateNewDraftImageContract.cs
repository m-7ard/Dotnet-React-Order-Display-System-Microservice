namespace Domain.Contracts.DraftImages;

public class CreateNewDraftImageContract
{
    public CreateNewDraftImageContract(string fileName, string originalFileName, string url)
    {
        FileName = fileName;
        OriginalFileName = originalFileName;
        Url = url;
    }

    public string FileName { get; set; }
    public string OriginalFileName { get; set; }
    public string Url { get; set; }
}