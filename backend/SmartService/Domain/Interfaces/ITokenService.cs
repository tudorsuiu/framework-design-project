using SmartService.Domain.Entities;

namespace SmartService.Domain.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}
