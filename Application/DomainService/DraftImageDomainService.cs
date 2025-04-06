using Application.Contracts.DomainService.DraftImageDomainService;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using Domain.Contracts.DraftImages;
using Domain.Models;
using Domain.ValueObjects.Shared;
using OneOf;

namespace Application.DomainService;

public class DraftImageDomainService : IDraftImageDomainService
{
    private readonly IDraftImageRepository _draftImageRepository;

    public DraftImageDomainService(IDraftImageRepository draftImageRepository)
    {
        _draftImageRepository = draftImageRepository;
    }

    public async Task<OneOf<DraftImage, string>> GetDraftImageByFileName(string fileName)
    {
        // Is valid filename
        var canCreateFileName = FileName.CanCreate(fileName);
        if (canCreateFileName.IsT1)
        {
            return canCreateFileName.AsT1;
        }

        var draftImageFileName = FileName.ExecuteCreate(fileName);
        
        // Draft image exists
        var draftImage = await _draftImageRepository.GetByFileNameAsync(draftImageFileName);
        if (draftImage is null)
        {
            return $"DraftImage of fileName \"{draftImageFileName}\" does not exist.";
        }

        return draftImage;
    }

    public async Task<OneOf<DraftImage, string>> TryOrchestrateCreateNewDraftImage(OrchestrateCreateNewDraftImageContract contract)
    {
        var createDraftImageContract = new CreateDraftImageContract(id: 0, fileName: contract.FileName, originalFileName: contract.OriginalFileName, url: contract.Url, dateCreated: DateTime.UtcNow);
        var canCreateDraftImage = DraftImage.CanCreate(createDraftImageContract);
        if (canCreateDraftImage.IsT1) return canCreateDraftImage.AsT1; 
        
        var draftImage = DraftImage.ExecuteCreate(createDraftImageContract);
        await _draftImageRepository.LazyCreateAsync(draftImage);
        return draftImage;
    }
}