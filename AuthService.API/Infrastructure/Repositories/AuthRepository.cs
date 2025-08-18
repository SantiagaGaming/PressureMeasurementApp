using AuthService.API.Data.Dto;
using AuthService.API.Data.Entities;
using AuthService.API.Infrastructure.Context;
using AuthService.API.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace AuthService.API.Infrastructure.Repositories
{
    public class AuthRepository(AuthDbContext context) : IAuthRepository
    {
        
        public async Task<User> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Email))
                throw new Exception("Email alredy exist");

            using var hmac = new HMACSHA512();
            var user = new User
            {
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                CreatedAt = DateTime.UtcNow
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();
            return user;
        }

        public async Task<User> Login(LoginDto loginDto)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null)
                throw new Exception("User doesn't exist");

            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                throw new Exception("Wrong password");

            return user;
        }

        public async Task<bool> UserExists(string email)
        {
            return await context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task InvalidateToken(string token)
        {
            var invalidToken = new InvalidToken
            {
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddDays(1)
            };
            context.InvalidTokens.Add(invalidToken);
            await context.SaveChangesAsync();
        }
    }
}
