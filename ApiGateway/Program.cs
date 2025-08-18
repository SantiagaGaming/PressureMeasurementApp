
using Microsoft.Extensions.Caching.Memory;
using System.Net;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace ApiGateway
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Добавляем CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            // Настройка reverse proxy
            builder.Services.AddReverseProxy()
                .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

            builder.Services.AddHttpClient();
            builder.Services.AddMemoryCache();

            // Настройка JWT аутентификации
            var jwtKey = builder.Configuration["Jwt:Key"];
            var jwtIssuer = builder.Configuration["Jwt:Issuer"];
            var jwtAudience = builder.Configuration["Jwt:Audience"];

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                        ValidateIssuer = true,
                        ValidIssuer = jwtIssuer,
                        ValidateAudience = true,
                        ValidAudience = jwtAudience,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                });

            builder.Services.AddAuthorization();

            var app = builder.Build();

            // Добавляем CORS middleware
            app.UseCors("AllowAll");

            // Middleware для валидации JWT токенов
            app.Use(async (context, next) =>
            {
                // Пропускаем запросы к аутентификации и документации
                if (context.Request.Path.StartsWithSegments("/auth") ||
                    context.Request.Path.StartsWithSegments("/swagger") ||
                    context.Request.Path.StartsWithSegments("/health"))
                {
                    await next();
                    return;
                }

                // Проверяем наличие токена в заголовке
                var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");

                if (string.IsNullOrEmpty(token))
                {
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    await context.Response.WriteAsync("Authorization token is required");
                    return;
                }

                // Валидируем токен через AuthService
                try
                {
                    var cache = context.RequestServices.GetRequiredService<IMemoryCache>();
                    var httpClientFactory = context.RequestServices.GetRequiredService<IHttpClientFactory>();
                    var httpClient = httpClientFactory.CreateClient();

                    // Проверяем кэш
                    if (cache.TryGetValue($"token_{token}", out bool isValid))
                    {
                        if (!isValid)
                        {
                            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                            await context.Response.WriteAsync("Invalid token (from cache)");
                            return;
                        }
                    }
                    else
                    {
                        // Валидируем токен через AuthService
                        var authServiceUrl = builder.Environment.IsDevelopment() 
                            ? "http://localhost:5206/api/auth/validate"
                            : "http://auth-service/api/auth/validate";
                        var validationRequest = new HttpRequestMessage(HttpMethod.Get, authServiceUrl);
                        validationRequest.Headers.Add("Authorization", $"Bearer {token}");

                        var validationResponse = await httpClient.SendAsync(validationRequest);

                        if (!validationResponse.IsSuccessStatusCode)
                        {
                            // Кэшируем невалидный токен на 5 минут
                            cache.Set($"token_{token}", false, TimeSpan.FromMinutes(5));
                            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                            await context.Response.WriteAsync("Invalid token");
                            return;
                        }

                        // Кэшируем валидный токен на 15 минут
                        cache.Set($"token_{token}", true, TimeSpan.FromMinutes(15));
                    }

                    // Добавляем информацию о пользователе в заголовки для передачи в микросервисы
                    try
                    {
                        var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
                        var jwtToken = tokenHandler.ReadJwtToken(token);
                        var userId = jwtToken.Claims.FirstOrDefault(x => x.Type == "nameid")?.Value;
                        var userEmail = jwtToken.Claims.FirstOrDefault(x => x.Type == "email")?.Value;

                        if (!string.IsNullOrEmpty(userId))
                        {
                            context.Request.Headers.Add("X-User-Id", userId);
                        }
                        if (!string.IsNullOrEmpty(userEmail))
                        {
                            context.Request.Headers.Add("X-User-Email", userEmail);
                        }
                    }
                    catch
                    {
                        // Игнорируем ошибки парсинга токена
                    }
                }
                catch (Exception ex)
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    await context.Response.WriteAsync($"Token validation error: {ex.Message}");
                    return;
                }

                await next();
            });

            app.MapReverseProxy();
            app.Run();
        }
    }
}
