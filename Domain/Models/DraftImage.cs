using Domain.Contracts.DraftImages;
using Domain.ValueObjects.Shared;
using OneOf;

namespace Domain.Models;

public class DraftImage
{
    private DraftImage(int id, FileName fileName, FileName originalFileName, string url, DateTime dateCreated)
    {
        Id = id;
        FileName = fileName;
        OriginalFileName = originalFileName;
        Url = url;
        DateCreated = dateCreated;
    }

    public int Id { get; private set; }
    public FileName FileName { get; private set; }
    public FileName OriginalFileName { get; private set; }
    public string Url { get; private set; }
    public DateTime DateCreated { get; private set; }

    public static OneOf<bool, string> CanCreate(CreateDraftImageContract contract)
    {
        var canCreateFileName = FileName.CanCreate(contract.FileName);
        if (canCreateFileName.IsT1) return canCreateFileName.AsT1;

        var canCreateOriginalFileName = FileName.CanCreate(contract.OriginalFileName);
        if (canCreateOriginalFileName.IsT1) return canCreateOriginalFileName.AsT1;

        return true;
    }

    public static DraftImage ExecuteCreate(CreateDraftImageContract contract)
    {
        var canCreate = CanCreate(contract);
        if (canCreate.IsT1) throw new Exception(canCreate.AsT1);

        var fileName = FileName.ExecuteCreate(contract.FileName);
        var originalFileName = FileName.ExecuteCreate(contract.OriginalFileName);
    
        return new DraftImage(id: contract.Id, fileName: fileName, originalFileName: originalFileName, url: contract.Url, dateCreated: contract.DateCreated);
    }

    public static OneOf<bool, string> CanCreateNew(CreateNewDraftImageContract contract)
    {
        var canCreateContract = new CreateDraftImageContract(id: 0, fileName: contract.FileName, originalFileName: contract.OriginalFileName, url: contract.Url, dateCreated: DateTime.UtcNow);
        var canCreate = CanCreate(canCreateContract);
        if (canCreate.IsT1) return canCreate.AsT1;

        return true;
    }

    public static DraftImage ExecuteCreateNew(CreateNewDraftImageContract contract)
    {
        var canCreateContract = new CreateDraftImageContract(id: 0, fileName: contract.FileName, originalFileName: contract.OriginalFileName, url: contract.Url, dateCreated: DateTime.UtcNow);
        var canCreate = CanCreate(canCreateContract);
        if (canCreate.IsT1) throw new Exception(canCreate.AsT1);

        return ExecuteCreate(canCreateContract);
    }
}