using Microsoft.EntityFrameworkCore;
using notification_service.Data;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. ADD SERVICES TO THE CONTAINER
// ==========================================

// Add support for Swagger API Documentation
// This helps us test our APIs easily in the browser
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers(); // Enables Web API Controllers

// Read the database connection string from appsettings.json
// This connects our .NET API to the MySQL Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Register the AppDbContext in the dependency injection container
// We are explicitly telling Entity Framework to use MySQL
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

// Register our Email Service
// AddScoped means a new instance is created once per HTTP request
builder.Services.AddScoped<notification_service.Services.IEmailService, notification_service.Services.EmailService>();

// Register our SMS Service Stub
builder.Services.AddScoped<notification_service.Services.ISmsService, notification_service.Services.SmsService>();

var app = builder.Build();

// ==========================================
// 2. CONFIGURE THE HTTP REQUEST PIPELINE
// ==========================================

// If we are in development mode, enable the Swagger UI
// Swagger provides a beautiful interface to test our endpoints
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Redirect all HTTP requests to secure HTTPS
app.UseHttpsRedirection();

// Map the API controllers to routes
app.MapControllers();

// Start the application and listen for incoming requests
app.Run();
