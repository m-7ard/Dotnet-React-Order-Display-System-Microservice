using Domain.Contracts.DraftImages;
using Domain.Models;
using Domain.ValueObjects.Shared;
using Infrastructure.DbEntities;

namespace Infrastructure.Mappers;

public static class DraftImageMapper
{
    public static DraftImage ToDomain(DraftImageDbEntity source)
    {   
        var contract = new CreateDraftImageContract(
            id: source.Id,
            fileName: source.FileName,
            originalFileName: source.OriginalFileName,
            url: source.Url,
            dateCreated: source.DateCreated
        );

        return DraftImage.ExecuteCreate(contract);
    }

    public static DraftImageDbEntity ToDbModel(DraftImage source)
    {
        return new DraftImageDbEntity(
            id: source.Id,
            fileName: source.FileName.Value,
            originalFileName: source.OriginalFileName.Value,
            dateCreated: source.DateCreated,
            url: source.Url
        );
    }
}