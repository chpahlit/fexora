using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Admin;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("admin/audit")]
[Authorize(Policy = "Admin")]
public class AdminAuditController(IAuditService auditService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetLogs(
        [FromQuery] string? entityType,
        [FromQuery] Guid? actorId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        var result = await auditService.GetLogs(entityType, actorId, page, pageSize);
        return Ok(ApiResponse<PaginatedResult<AuditLogResponse>>.Ok(result));
    }
}
