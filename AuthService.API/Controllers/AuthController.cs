using AuthService.API.Data.Dto;
using AuthService.API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController(IAuthRepository authRepo, ITokenService tokenService) : ControllerBase
    {

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            var user = await authRepo.Register(registerDto);
            var token = tokenService.GenerateToken(user);
            return Ok(new { token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var user = await authRepo.Login(loginDto);
            var token = tokenService.GenerateToken(user);
            return Ok(new { token });
        }

        [HttpGet("validate")]
        public IActionResult ValidateToken([FromHeader] string authorization)
        {
            var isValid = tokenService.ValidateToken(authorization);
            return Ok(new { valid = isValid });
        }
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromHeader(Name = "Authorization")] string authorization)
        {
            if (string.IsNullOrEmpty(authorization))
                return BadRequest("Token doesn't exist");

            var token = tokenService.GetTokenFromHeader(authorization);
            await authRepo.InvalidateToken(token);
            return Ok("Sucess");
        }
    }
}
