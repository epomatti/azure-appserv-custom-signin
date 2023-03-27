using Microsoft.Identity.Web;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// JwtSecurityTokenHandler.DefaultMapInboundClaims = false;

builder.Services.AddAuthentication().AddAppServicesAuthentication();

builder.Services.AddCors(options =>
{
  options.AddPolicy("all",
      builder => builder.AllowAnyOrigin()
      .AllowAnyMethod()
      .AllowAnyHeader());
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseCors("all");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
