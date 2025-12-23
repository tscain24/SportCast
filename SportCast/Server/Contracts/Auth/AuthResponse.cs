namespace SportCast.Server.Contracts.Auth;

public record AuthResponse(string UserId, string DisplayName, string Token);
