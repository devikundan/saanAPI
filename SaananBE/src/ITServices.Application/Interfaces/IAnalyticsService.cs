using ITServices.Application.DTOs.Analytics;
using ITServices.Application.DTOs.Common;

namespace ITServices.Application.Interfaces;

public interface IAnalyticsService
{
    Task<ApiResponse<DashboardSummaryDto>> GetDashboardSummaryAsync();
}
