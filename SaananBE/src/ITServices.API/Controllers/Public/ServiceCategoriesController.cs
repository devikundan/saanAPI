using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.ServiceCategories;
using ITServices.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace ITServices.API.Controllers.Public;

[ApiController]
[Route("api/service-categories")]
[ApiExplorerSettings(GroupName = "public")]
[EnableRateLimiting("GeneralApi")]
public class ServiceCategoriesController : ControllerBase
{
    private readonly IServiceCategoryService _serviceCategoryService;

    public ServiceCategoriesController(IServiceCategoryService serviceCategoryService)
    {
        _serviceCategoryService = serviceCategoryService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<ServiceCategoryResponseDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetActiveCategories()
    {
        var result = await _serviceCategoryService.GetActiveCategoriesAsync();
        return Ok(result);
    }

    [HttpGet("with-services")]
    [ProducesResponseType(typeof(ApiResponse<List<ServiceCategoryWithServicesDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetActiveCategoriesWithServices()
    {
        var result = await _serviceCategoryService.GetActiveCategoriesWithServicesAsync();
        return Ok(result);
    }
}
