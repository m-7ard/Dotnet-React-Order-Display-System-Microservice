namespace Application.Contracts.Models;

public class UploadImageData
{
    public UploadImageData(string fileName, string originalFileName, string url)
    {
        FileName = fileName;
        OriginalFileName = originalFileName;
        Url = url;
    }

    public string FileName { get; set; }
    public string OriginalFileName { get; set; }
    public string Url { get; set; }
}