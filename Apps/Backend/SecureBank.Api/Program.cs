using SecureBank.Api.Exceptions;
using SecureBank.Api.Repositories;
using SecureBank.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendDevPolicy", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://localhost:5176",
                "http://localhost:5177",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174",
                "http://127.0.0.1:5175",
                "http://127.0.0.1:5176",
                "http://127.0.0.1:5177",
                "http://192.168.1.8:5177")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddSingleton<IUserRepository, InMemoryUserRepository>();
builder.Services.AddScoped<ISignupService, SignupService>();
builder.Services.AddScoped<ISigninService, SigninService>();
builder.Services.AddScoped<ITransferService, TransferService>();
builder.Services.AddSingleton<ITransferRepository, InMemoryTransferRepository>();

var app = builder.Build();
app.UseCors("FrontendDevPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        var exception = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>()?.Error;

        if (exception is null)
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new
            {
                success = false,
                error = new { code = "INTERNAL_SERVER_ERROR", message = "An unexpected error occurred." }
            });
            return;
        }

        context.Response.ContentType = "application/json";

        switch (exception)
        {
            case SignupValidationException validationException:
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                await context.Response.WriteAsJsonAsync(new
                {
                    success = false,
                    error = new { code = validationException.Code, message = validationException.Message }
                });
                break;
            case SignupConflictException conflictException:
                context.Response.StatusCode = StatusCodes.Status409Conflict;
                await context.Response.WriteAsJsonAsync(new
                {
                    success = false,
                    error = new { code = conflictException.Code, message = conflictException.Message }
                });
                break;
            case SigninValidationException signinValidationException:
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                await context.Response.WriteAsJsonAsync(new
                {
                    success = false,
                    error = new { code = signinValidationException.Code, message = signinValidationException.Message }
                });
                break;
            case SigninAuthenticationException signinAuthenticationException:
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsJsonAsync(new
                {
                    success = false,
                    error = new { code = signinAuthenticationException.Code, message = signinAuthenticationException.Message }
                });
                break;
            default:
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                await context.Response.WriteAsJsonAsync(new
                {
                    success = false,
                    error = new { code = "INTERNAL_SERVER_ERROR", message = "An unexpected error occurred." }
                });
                break;
        }
    });
});

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

public partial class Program { }
