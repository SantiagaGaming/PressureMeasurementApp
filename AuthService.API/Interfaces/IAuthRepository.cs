using AuthService.API.Data.Dto;
using AuthService.API.Data.Entities;

namespace AuthService.API.Interfaces
{
    public interface IAuthRepository
    {
        Task<User> Register(RegisterDto registerDto);
        Task<User> Login(LoginDto loginDto);
        Task<bool> UserExists(string email);
        Task InvalidateToken(string token);
    }
}
