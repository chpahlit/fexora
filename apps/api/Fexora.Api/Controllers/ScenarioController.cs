using Fexora.Core.DTOs;
using Fexora.Core.Entities;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("scenarios")]
[Authorize(Policy = "Admin")]
public class ScenarioController(IScenarioService scenarioService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<ApiResponse<Scenario>>> Create([FromBody] CreateScenarioRequest request)
    {
        var scenario = await scenarioService.CreateAsync(request.Name, request.Description);
        return Ok(ApiResponse<Scenario>.Ok(scenario));
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PaginatedResult<Scenario>>>> List(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await scenarioService.ListAsync(page, pageSize);
        return Ok(ApiResponse<PaginatedResult<Scenario>>.Ok(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<Scenario>>> Get(Guid id)
    {
        var scenario = await scenarioService.GetAsync(id);
        if (scenario is null) return NotFound(ApiResponse<Scenario>.Fail("Not found."));
        return Ok(ApiResponse<Scenario>.Ok(scenario));
    }

    [HttpPatch("{id:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> Update(Guid id, [FromBody] UpdateScenarioRequest request)
    {
        try
        {
            await scenarioService.UpdateAsync(id, request.Name, request.Description);
            return Ok(ApiResponse<bool>.Ok(true));
        }
        catch (ArgumentException ex) { return BadRequest(ApiResponse<bool>.Fail(ex.Message)); }
    }

    [HttpPost("{id:guid}/activate")]
    public async Task<ActionResult<ApiResponse<bool>>> Activate(Guid id)
    {
        try
        {
            await scenarioService.ActivateAsync(id);
            return Ok(ApiResponse<bool>.Ok(true));
        }
        catch (Exception ex) when (ex is ArgumentException or InvalidOperationException)
        {
            return BadRequest(ApiResponse<bool>.Fail(ex.Message));
        }
    }

    [HttpPost("{id:guid}/pause")]
    public async Task<ActionResult<ApiResponse<bool>>> Pause(Guid id)
    {
        try
        {
            await scenarioService.PauseAsync(id);
            return Ok(ApiResponse<bool>.Ok(true));
        }
        catch (ArgumentException ex) { return BadRequest(ApiResponse<bool>.Fail(ex.Message)); }
    }

    [HttpPost("{id:guid}/steps")]
    public async Task<ActionResult<ApiResponse<bool>>> AddStep(Guid id, [FromBody] ScenarioStep step)
    {
        try
        {
            await scenarioService.AddStepAsync(id, step);
            return Ok(ApiResponse<bool>.Ok(true));
        }
        catch (ArgumentException ex) { return BadRequest(ApiResponse<bool>.Fail(ex.Message)); }
    }

    [HttpDelete("steps/{stepId:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> RemoveStep(Guid stepId)
    {
        await scenarioService.RemoveStepAsync(stepId);
        return Ok(ApiResponse<bool>.Ok(true));
    }

    [HttpPost("{id:guid}/enroll")]
    public async Task<ActionResult<ApiResponse<bool>>> Enroll(Guid id, [FromBody] EnrollRequest request)
    {
        await scenarioService.EnrollUserAsync(id, request.UserId);
        return Ok(ApiResponse<bool>.Ok(true));
    }
}

public record CreateScenarioRequest(string Name, string? Description);
public record UpdateScenarioRequest(string? Name, string? Description);
public record EnrollRequest(Guid UserId);
