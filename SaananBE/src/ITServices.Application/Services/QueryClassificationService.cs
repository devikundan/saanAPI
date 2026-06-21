using AutoMapper;
using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.QueryClassification;
using ITServices.Application.Interfaces;
using ITServices.Domain.Entities;
using ITServices.Domain.Interfaces;

namespace ITServices.Application.Services;

public class QueryClassificationService : IQueryClassificationService
{
    private readonly IQueryClassificationRepository _repository;
    private readonly IServiceRepository _serviceRepository;
    private readonly IMapper _mapper;

    public QueryClassificationService(
        IQueryClassificationRepository repository,
        IServiceRepository serviceRepository,
        IMapper mapper)
    {
        _repository = repository;
        _serviceRepository = serviceRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<QueryClassificationResponseDto>> ClassifyQueryAsync(ClassifyQueryRequestDto request)
    {
        // AI-based classification using keyword matching (production: integrate with Azure OpenAI or similar)
        var classification = await PerformClassificationAsync(request.Query);

        var entity = new QueryClassification
        {
            Id = Guid.NewGuid(),
            LeadId = request.LeadId,
            ContactMessageId = request.ContactMessageId,
            OriginalQuery = request.Query,
            ClassifiedCategory = classification.Category,
            SuggestedServiceSlug = classification.ServiceSlug,
            ConfidenceScore = classification.Confidence,
            AiResponse = classification.Response,
            ClassifiedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(entity);
        var result = _mapper.Map<QueryClassificationResponseDto>(entity);
        return ApiResponse<QueryClassificationResponseDto>.SuccessResponse(result, "Query classified successfully.");
    }

    public async Task<ApiResponse<List<QueryClassificationResponseDto>>> GetRecentClassificationsAsync(int count = 20)
    {
        var classifications = await _repository.GetRecentClassificationsAsync(count);
        var result = _mapper.Map<List<QueryClassificationResponseDto>>(classifications);
        return ApiResponse<List<QueryClassificationResponseDto>>.SuccessResponse(result);
    }

    public async Task<ApiResponse<QueryClassificationResponseDto>> GetByIdAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<QueryClassificationResponseDto>.FailResponse("Classification not found.");

        var result = _mapper.Map<QueryClassificationResponseDto>(entity);
        return ApiResponse<QueryClassificationResponseDto>.SuccessResponse(result);
    }

    private async Task<(string Category, string? ServiceSlug, double Confidence, string Response)> PerformClassificationAsync(string query)
    {
        var queryLower = query.ToLowerInvariant();

        // Rule-based classification with confidence scoring
        // In production, replace with Azure OpenAI / ML model call
        var categories = new Dictionary<string, (string[] Keywords, string ServiceSlug)>
        {
            ["Web Development"] = (new[] { "website", "web app", "frontend", "angular", "react", "html", "css", "responsive", "landing page", "ecommerce" }, "website-development"),
            ["AI & Machine Learning"] = (new[] { "ai", "artificial intelligence", "machine learning", "ml", "chatbot", "nlp", "deep learning", "neural", "automation ai" }, "ai-agents"),
            ["Cloud Solutions"] = (new[] { "cloud", "aws", "azure", "gcp", "hosting", "migration", "serverless", "docker", "kubernetes" }, "cloud-solutions"),
            ["API & Backend"] = (new[] { "api", "backend", "microservice", "rest", "graphql", "server", ".net", "node", "database api" }, "api-backend-development"),
            ["Automation"] = (new[] { "automate", "automation", "rpa", "workflow", "scripting", "bot", "process automation" }, "automation"),
            ["DevOps"] = (new[] { "devops", "ci/cd", "pipeline", "deployment", "infrastructure", "terraform", "ansible", "monitoring" }, "devops"),
            ["Database Design"] = (new[] { "database", "sql", "nosql", "schema", "data model", "postgresql", "mongodb", "optimization" }, "database-design"),
        };

        string bestCategory = "General IT Services";
        string? bestSlug = null;
        double bestScore = 0.0;
        int matchCount = 0;

        foreach (var (category, (keywords, slug)) in categories)
        {
            var hits = keywords.Count(k => queryLower.Contains(k));
            if (hits > 0)
            {
                var score = (double)hits / keywords.Length;
                if (score > bestScore)
                {
                    bestScore = score;
                    bestCategory = category;
                    bestSlug = slug;
                    matchCount = hits;
                }
            }
        }

        // Normalize confidence: base 0.4 + keyword density bonus
        var confidence = matchCount > 0
            ? Math.Min(0.4 + (bestScore * 0.6), 0.95)
            : 0.2;

        var response = $"Based on your query, this appears to be related to {bestCategory}. " +
                       $"We recommend exploring our {bestCategory} services for the best solution.";

        // Verify that the suggested service slug actually exists
        if (bestSlug != null)
        {
            var service = await _serviceRepository.GetBySlugAsync(bestSlug);
            if (service == null)
                bestSlug = null;
        }

        return (bestCategory, bestSlug, confidence, response);
    }
}
