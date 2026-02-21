FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy solution and project files
COPY *.slnx .
COPY Fexora.Api/*.csproj Fexora.Api/
COPY Fexora.Core/*.csproj Fexora.Core/
COPY Fexora.Infrastructure/*.csproj Fexora.Infrastructure/
COPY Fexora.Orchestrator/*.csproj Fexora.Orchestrator/

# Restore
RUN dotnet restore

# Copy everything and build
COPY . .
RUN dotnet publish Fexora.Api -c Release -o /app/publish

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Fexora.Api.dll"]
