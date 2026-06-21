using AutoMapper;
using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.ProposalSummary;
using ITServices.Application.Interfaces;
using ITServices.Domain.Entities;
using ITServices.Domain.Interfaces;

namespace ITServices.Application.Services;

public class ProposalSummaryService : IProposalSummaryService
{
    private readonly IProposalSummaryRepository _repository;
    private readonly ILeadRepository _leadRepository;
    private readonly IServiceRepository _serviceRepository;
    private readonly IMapper _mapper;

    public ProposalSummaryService(
        IProposalSummaryRepository repository,
        ILeadRepository leadRepository,
        IServiceRepository serviceRepository,
        IMapper mapper)
    {
        _repository = repository;
        _leadRepository = leadRepository;
        _serviceRepository = serviceRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<ProposalSummaryResponseDto>> GenerateProposalAsync(GenerateProposalRequestDto request)
    {
        var lead = await _leadRepository.GetByIdWithServiceAsync(request.LeadId);
        if (lead == null)
            return ApiResponse<ProposalSummaryResponseDto>.FailResponse("Lead not found.");

        // Generate proposal summary (in production, integrate with Azure OpenAI)
        var generatedSummary = GenerateProposalContent(request, lead);

        var entity = new ProposalSummary
        {
            Id = Guid.NewGuid(),
            LeadId = request.LeadId,
            ClientName = request.ClientName,
            ProjectScope = request.ProjectScope,
            GeneratedSummary = generatedSummary.Summary,
            EstimatedTimeline = generatedSummary.Timeline,
            EstimatedBudgetRange = generatedSummary.BudgetRange,
            RecommendedServices = generatedSummary.Services,
            TechStack = generatedSummary.TechStack,
            GeneratedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(entity);
        var result = _mapper.Map<ProposalSummaryResponseDto>(entity);
        return ApiResponse<ProposalSummaryResponseDto>.SuccessResponse(result, "Proposal generated successfully.");
    }

    public async Task<ApiResponse<ProposalSummaryResponseDto>> GetByLeadIdAsync(Guid leadId)
    {
        var entity = await _repository.GetByLeadIdAsync(leadId);
        if (entity == null)
            return ApiResponse<ProposalSummaryResponseDto>.FailResponse("No proposal found for this lead.");

        var result = _mapper.Map<ProposalSummaryResponseDto>(entity);
        return ApiResponse<ProposalSummaryResponseDto>.SuccessResponse(result);
    }

    public async Task<ApiResponse<ProposalSummaryResponseDto>> GetByIdAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<ProposalSummaryResponseDto>.FailResponse("Proposal not found.");

        var result = _mapper.Map<ProposalSummaryResponseDto>(entity);
        return ApiResponse<ProposalSummaryResponseDto>.SuccessResponse(result);
    }

    public async Task<ApiResponse<List<ProposalSummaryResponseDto>>> GetRecentProposalsAsync(int count = 20)
    {
        var proposals = await _repository.GetRecentProposalsAsync(count);
        var result = _mapper.Map<List<ProposalSummaryResponseDto>>(proposals);
        return ApiResponse<List<ProposalSummaryResponseDto>>.SuccessResponse(result);
    }

    private static (string Summary, string Timeline, string BudgetRange, string Services, string TechStack) GenerateProposalContent(
        GenerateProposalRequestDto request, Lead lead)
    {
        // Rule-based proposal generation (in production, use Azure OpenAI for intelligent generation)
        var scopeLower = request.ProjectScope.ToLowerInvariant();

        var timeline = request.Timeline ?? EstimateTimeline(scopeLower);
        var budgetRange = request.BudgetRange ?? EstimateBudget(scopeLower);
        var techStack = request.PreferredTechStack ?? SuggestTechStack(scopeLower);
        var services = DetermineServices(scopeLower);

        var summary = $"Project Proposal for {request.ClientName}\n\n" +
                      $"## Project Overview\n{request.ProjectScope}\n\n" +
                      $"## Recommended Approach\nBased on the project requirements, we recommend a phased approach:\n" +
                      $"- Phase 1: Discovery & Planning\n" +
                      $"- Phase 2: Design & Architecture\n" +
                      $"- Phase 3: Development & Integration\n" +
                      $"- Phase 4: Testing & QA\n" +
                      $"- Phase 5: Deployment & Support\n\n" +
                      $"## Estimated Timeline: {timeline}\n" +
                      $"## Budget Range: {budgetRange}\n" +
                      $"## Recommended Tech Stack: {techStack}\n" +
                      $"## Services Included: {services}";

        return (summary, timeline, budgetRange, services, techStack);
    }

    private static string EstimateTimeline(string scope)
    {
        var wordCount = scope.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;
        if (wordCount < 30) return "2-4 weeks";
        if (wordCount < 80) return "4-8 weeks";
        return "8-16 weeks";
    }

    private static string EstimateBudget(string scope)
    {
        if (scope.Contains("enterprise") || scope.Contains("large scale"))
            return "$25,000 - $75,000";
        if (scope.Contains("medium") || scope.Contains("custom"))
            return "$10,000 - $30,000";
        return "$5,000 - $15,000";
    }

    private static string SuggestTechStack(string scope)
    {
        var techs = new List<string>();

        if (scope.Contains("web") || scope.Contains("frontend"))
            techs.Add("Angular/React");
        if (scope.Contains("api") || scope.Contains("backend") || scope.Contains(".net"))
            techs.Add("ASP.NET Core");
        if (scope.Contains("database") || scope.Contains("sql"))
            techs.Add("SQL Server");
        if (scope.Contains("cloud") || scope.Contains("azure"))
            techs.Add("Azure");
        if (scope.Contains("ai") || scope.Contains("machine learning"))
            techs.Add("Azure AI Services");

        if (techs.Count == 0)
            techs.AddRange(new[] { "ASP.NET Core", "Angular", "SQL Server", "Azure" });

        return string.Join(", ", techs);
    }

    private static string DetermineServices(string scope)
    {
        var services = new List<string>();

        if (scope.Contains("web") || scope.Contains("frontend") || scope.Contains("ui"))
            services.Add("Website Development");
        if (scope.Contains("api") || scope.Contains("backend"))
            services.Add("API/Backend Development");
        if (scope.Contains("cloud") || scope.Contains("hosting") || scope.Contains("deploy"))
            services.Add("Cloud Solutions");
        if (scope.Contains("ai") || scope.Contains("automation"))
            services.Add("AI & Automation");
        if (scope.Contains("devops") || scope.Contains("ci/cd"))
            services.Add("DevOps");
        if (scope.Contains("database"))
            services.Add("Database Design");

        if (services.Count == 0)
            services.Add("Custom IT Solutions");

        return string.Join(", ", services);
    }
}
