using SportCast.Server.Application.Results;
using SportCast.Server.Contracts.Auth;

namespace SportCast.Server.Application.Interfaces;

public interface ILoginUserHandler
{
    Task<HandlerResult<AuthResponse>> HandleAsync(LoginRequest request, CancellationToken cancellationToken);
}
