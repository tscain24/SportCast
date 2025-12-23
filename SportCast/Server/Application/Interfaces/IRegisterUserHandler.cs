using SportCast.Server.Application.Results;
using SportCast.Server.Contracts.Auth;

namespace SportCast.Server.Application.Interfaces;

public interface IRegisterUserHandler
{
    Task<HandlerResult<RegisterResponse>> HandleAsync(RegisterRequest request, CancellationToken cancellationToken);
}
