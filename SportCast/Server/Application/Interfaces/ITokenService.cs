using SportCast.Server.Domain.Entities;

namespace SportCast.Server.Application.Interfaces;

public interface ITokenService
{
    string CreateToken(ApplicationUser user);
}
