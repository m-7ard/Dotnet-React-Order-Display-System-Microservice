namespace Infrastructure.DbEntities;

public class DraftImageDbEntity
{
    public DraftImageDbEntity(int id, string fileName, string originalFileName, string url, DateTime dateCreated)
    {
        Id = id;
        FileName = fileName;
        OriginalFileName = originalFileName;
        Url = url;
        DateCreated = dateCreated;
    }

    public int Id { get; private set; }
    public string FileName { get; private set; }
    public string OriginalFileName { get; private set; }
    public string Url { get; private set; }
    public DateTime DateCreated { get; private set; }
}