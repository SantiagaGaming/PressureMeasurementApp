using AuthService.API.Data.Dto;
using AuthService.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;

namespace AuthService.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    [EnableCors("AllowAll")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepo;
        private readonly ITokenService _tokenService;

        public AuthController(IAuthRepository authRepo, ITokenService tokenService)
        {
            _authRepo = authRepo;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            try
            {
                var user = await _authRepo.Register(registerDto);
                var token = _tokenService.GenerateToken(user);
                return Ok(new { token, user = new { user.Id, user.Email, user.CreatedAt } });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            try
            {
                var user = await _authRepo.Login(loginDto);
                var token = _tokenService.GenerateToken(user);
                return Ok(new { token, user = new { user.Id, user.Email, user.CreatedAt } });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("validate")]
        public IActionResult ValidateToken([FromHeader(Name = "Authorization")] string authorization)
        {
            if (string.IsNullOrEmpty(authorization))
                return BadRequest(new { valid = false, error = "Authorization header is required" });

            var isValid = _tokenService.ValidateToken(authorization);
            return Ok(new { valid = isValid });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromHeader(Name = "Authorization")] string authorization)
        {
            if (string.IsNullOrEmpty(authorization))
                return BadRequest(new { error = "Token doesn't exist" });

            try
            {
                var token = _tokenService.GetTokenFromHeader(authorization);
                await _authRepo.InvalidateToken(token);
                return Ok(new { message = "Success" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
