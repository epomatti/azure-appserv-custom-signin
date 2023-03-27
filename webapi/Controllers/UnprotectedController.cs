using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace webapi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UnprotectedController : ControllerBase
{

  private readonly ILogger<UnprotectedController> _logger;

  public UnprotectedController(ILogger<UnprotectedController> logger)
  {
    _logger = logger;
  }

  [HttpGet(Name = "GetUnprotectedResponse")]
  public Response Get()
  {
    return new Response
    {
      Value = "Unprotected value"
    };
  }
}
