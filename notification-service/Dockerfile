# Notification Service Dockerfile
# Using official .NET SDK image for build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
# Copy everything and build
COPY . .
# RUN dotnet restore
# RUN dotnet publish -c Release -o /app/publish

# Using runtime image for execution
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
# COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "NotificationService.dll"]
