# Build .NET backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /src/
COPY ["Api/Api.csproj", "Api/"]
COPY ["Domain/Domain.csproj", "Domain/"]
COPY ["Application/Application.csproj", "Application/"]
COPY ["Infrastructure/Infrastructure.csproj", "Infrastructure/"]
COPY ["Files/Files.csproj", "Files/"]
RUN dotnet restore "Api/Api.csproj"
COPY . .
WORKDIR "/src/Api"
RUN dotnet build "Api.csproj" -c Release -o /app/build
RUN dotnet publish "Api.csproj" -c Release -o /app/publish

# Final image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=backend-build /app/publish .

ENTRYPOINT ["dotnet", "Api.dll"]