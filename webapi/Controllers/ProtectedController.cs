using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace webapi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProtectedController : ControllerBase
{

  private readonly ILogger<ProtectedController> _logger;

  public ProtectedController(ILogger<ProtectedController> logger)
  {
    _logger = logger;
  }

  [HttpGet(Name = "GetProtectedResponse")]
  public Response Get()
  {
    return new Response
    {
      Value = "Protected value"
    };
  }
}
