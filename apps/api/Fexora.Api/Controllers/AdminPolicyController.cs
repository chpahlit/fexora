using System.Security.Claims;
using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Admin;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("admin/policy")]
[Authorize(Policy = "Admin")]
public class AdminPolicyController(IPolicyService policyService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var configs = await policyService.GetAll();
        return Ok(ApiResponse<List<PolicyConfigResponse>>.Ok(configs));
    }

    [HttpPut("{key}")]
    public async Task<IActionResult> SetValue(string key, [FromBody] UpdatePolicyRequest request)
    {
        var actorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await policyService.SetValue(key, request.Value, actorId);
        return Ok(ApiResponse<object>.Ok(new { success = true }));
    }
}
