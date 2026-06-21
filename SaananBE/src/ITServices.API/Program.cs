using ITServices.API.Extensions;
using ITServices.API.Middleware;
using ITServices.Infrastructure;
using ITServices.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// Add controllers
builder.Services.AddControllers();

// Add infrastructure (EF Core, Repositories, Email)
builder.Services.AddInfrastructure(builder.Configuration);

// Add application services (business logic, AutoMapper, FluentValidation)
builder.Services.AddApplicationServices();

// Add JWT authentication
builder.Services.AddJwtAuthentication(builder.Configuration);

// Add Swagger
builder.Services.AddSwaggerConfiguration();

// Add CORS
builder.Services.AddCorsConfiguration(builder.Configuration);

// Add rate limiting
builder.Services.AddRateLimitingConfiguration();

var app = builder.Build();

// Seed database
await DatabaseSeeder.SeedAsync(app.Services);

// Configure middleware pipeline
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/public/swagger.json", "IT Services - Public API");
    options.SwaggerEndpoint("/swagger/admin/swagger.json", "IT Services - Admin API");
    options.RoutePrefix = "swagger";
});

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseCors("AllowAngularApp");

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
