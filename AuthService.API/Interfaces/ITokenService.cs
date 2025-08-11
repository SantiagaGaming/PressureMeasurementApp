using AuthService.API.Data.Entities;

namespace AuthService.API.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(User user);
        bool ValidateToken(string token);
        string GetTokenFromHeader(string authorizationHeader);
    }
}
