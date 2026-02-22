using Fexora.Core.DTOs;
using Fexora.Core.Entities;
using Fexora.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fexora.Api.Controllers;

[ApiController]
[Route("templates")]
[Authorize(Policy = "Admin")]
public class TemplateController(ITemplateService templateService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<ApiResponse<MessageTemplate>>> Create([FromBody] CreateTemplateRequest request)
    {
        var template = await templateService.CreateAsync(request.Name, request.BodyText, request.VariablesJson, request.AbGroup);
        return Ok(ApiResponse<MessageTemplate>.Ok(template));
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PaginatedResult<MessageTemplate>>>> List(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await templateService.ListAsync(page, pageSize);
        return Ok(ApiResponse<PaginatedResult<MessageTemplate>>.Ok(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<MessageTemplate>>> Get(Guid id)
    {
        var template = await templateService.GetAsync(id);
        if (template is null) return NotFound(ApiResponse<MessageTemplate>.Fail("Not found."));
        return Ok(ApiResponse<MessageTemplate>.Ok(template));
    }

    [HttpPatch("{id:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> Update(Guid id, [FromBody] UpdateTemplateRequest request)
    {
        try
        {
            await templateService.UpdateAsync(id, request.Name, request.BodyText);
            return Ok(ApiResponse<bool>.Ok(true));
        }
        catch (ArgumentException ex) { return BadRequest(ApiResponse<bool>.Fail(ex.Message)); }
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
    {
        await templateService.DeleteAsync(id);
        return Ok(ApiResponse<bool>.Ok(true));
    }

    [HttpPost("{id:guid}/preview")]
    public async Task<ActionResult<ApiResponse<string>>> Preview(Guid id, [FromBody] Dictionary<string, string> variables)
    {
        try
        {
            var rendered = await templateService.RenderAsync(id, variables);
            return Ok(ApiResponse<string>.Ok(rendered));
        }
        catch (ArgumentException ex) { return BadRequest(ApiResponse<string>.Fail(ex.Message)); }
    }
}

public record CreateTemplateRequest(string Name, string BodyText, string? VariablesJson, string? AbGroup);
public record UpdateTemplateRequest(string? Name, string? BodyText);
