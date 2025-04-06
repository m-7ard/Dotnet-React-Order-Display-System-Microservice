namespace Infrastructure.DbEntities;

public class ProductImageDbEntity
{
    public ProductImageDbEntity(Guid id, string fileName, DateTime dateCreated, Guid? productId, string originalFileName, string url)
    {
        Id = id;
        FileName = fileName;
        DateCreated = dateCreated;
        ProductId = productId;
        OriginalFileName = originalFileName;
        Url = url;
    }

    public Guid Id { get; private set; }
    public string FileName { get; private set; }
    public string OriginalFileName { get; private set; }
    public string Url { get; private set; }
    public DateTime DateCreated { get; private set; }
    
    // Product FK
    public Guid? ProductId { get; set; }
    public ProductDbEntity? Product { get; private set; }
}