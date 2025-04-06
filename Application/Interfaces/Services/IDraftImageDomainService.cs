using Application.Contracts.DomainService.DraftImageDomainService;
using Domain.Models;
using OneOf;

namespace Application.Interfaces.Services;

public interface IDraftImageDomainService
{
    Task<OneOf<DraftImage, string>> GetDraftImageByFileName(string fileName);
    Task<OneOf<DraftImage, string>> TryOrchestrateCreateNewDraftImage(OrchestrateCreateNewDraftImageContract contract);
}