using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using PressureMeasurementApp.API.Data.Dto;
using PressureMeasurementApp.API.Data.Entitites;
using PressureMeasurementApp.API.Hubs;
using PressureMeasurementApp.API.Infrastructure.Context;
using PressureMeasurementApp.API.Infrastructure.Repositories;
using PressureMeasurementApp.API.Interfaces;
using PressureMeasurementApp.API.Services;
using StackExchange.Redis;

namespace PressureMeasurementApp.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.WebHost.UseUrls("http://0.0.0.0:5000");
            builder.Services.AddCors(policy => policy.AddPolicy("default", opt =>
            {
                opt.AllowAnyHeader();
                opt.AllowCredentials();
                opt.AllowAnyMethod();
                opt.SetIsOriginAllowed(_ => true);
            }));
            builder.Services.AddControllers();
            builder.Services.AddHttpClient();
            builder.Services.AddHttpContextAccessor();
            var connectionString = builder.Configuration.GetConnectionString("AppDbConnection");
            builder.Services.AddDbContext<AppDbContext>(options => options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
            builder.Services.AddSwaggerGen();
            builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
            {
                var configuration = ConfigurationOptions.Parse(builder.Configuration.GetConnectionString("Redis"));
                return ConnectionMultiplexer.Connect(configuration);
            });
            builder.Services.AddSignalR();
            builder.Services.AddSingleton<ICacheService, RedisCacheService>();
            builder.Services.AddSingleton<IKafkaProducer, KafkaProducer>();
            builder.Services.AddAutoMapper(typeof(Program));
            builder.Services.AddTransient<IRepository<PressureMeasurement>, PressureMeasurementRepository>();
            builder.Services.AddTransient<IParseToFile<PressureMeasurementToFile>, MeasurementsParseToFile>();
            builder.Services.AddTransient<IPressureConverter, PressureConverter>();
            builder.Services.AddTransient<IKafkaMessanger, KafkaMessanger>();
            builder.Services.AddTransient<IPressureMeasurementService, PressureMeasurementService>();
            builder.Services.AddSingleton<IHubContext<PressureMeasurementHub>>(provider =>
         provider.GetRequiredService<IHubContext<PressureMeasurementHub>>());

            var app = builder.Build();

            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseCors("default");
            app.UseRouting();

            app.MapHub<PressureMeasurementHub>("/pressureHub");
            app.UseEndpoints(endpoints =>
            {
    endpoints.MapControllers();
            });
            app.Run();
        }
    }
}
