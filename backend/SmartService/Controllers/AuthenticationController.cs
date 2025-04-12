using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SmartService.Domain;
using SmartService.Domain.DTOs;
using SmartService.Domain.Entities;
using SmartService.Domain.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SmartService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IPasswordHasherService _passwordHasherService;
        private readonly ITokenService _tokenService;

        public AuthenticationController(ApplicationDbContext context, IPasswordHasherService passwordHasherService, ITokenService tokenService)
        {
            _context = context;
            _passwordHasherService = passwordHasherService;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoggedUserDTO>> Login([FromBody] UserLoginDTO request)
        {
            var users = _context.Users;

            var foundUser = users.FirstOrDefault(u => u.Email == request.Email);
            if (foundUser is null || !_passwordHasherService.Verify(foundUser.Password, request.Password))
            {
                return NotFound("Wrong credentials!");
            }

            IQueryable<CarDTO> cars = Enumerable.Empty<CarDTO>().AsQueryable();
            IQueryable<ReparationDTO> reparations = Enumerable.Empty<ReparationDTO>().AsQueryable();
            IQueryable<BillDTO> bills = Enumerable.Empty<BillDTO>().AsQueryable();

            if (foundUser.Role == "User")
            {
                cars = _context.Cars.Where(c => c.UserId == foundUser.Id).Select(c => new CarDTO
                {
                    Id = c.Id,
                    UserId = c.UserId,
                    Brand = c.Brand,
                    Model = c.Model,
                    FabricationYear = c.FabricationYear,
                    LicensePlate = c.LicensePlate
                });

                reparations = _context.Reparations.Where(r => r.UserId == foundUser.Id).Select(r => new ReparationDTO
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    MechanicId = r.MechanicId,
                    CarId = r.CarId,
                    Type = r.Type,
                    Description = r.Description,
                    Date = r.Date,
                    Status = r.Status,
                });

                bills = _context.Bills.Where(b => b.UserId == foundUser.Id).Select(b => new BillDTO
                {
                    Id = b.Id,
                    ReparationId = b.ReparationId,
                    UserId = b.UserId,
                    Date = b.Date,
                    Total = b.Total,
                });
            }
            else if (foundUser.Role == "Mechanic")
            {
                cars = _context.Cars.Select(c => new CarDTO
                {
                    Id = c.Id,
                    UserId = c.UserId,
                    Brand = c.Brand,
                    Model = c.Model,
                    FabricationYear = c.FabricationYear,
                    LicensePlate = c.LicensePlate
                });

                reparations = _context.Reparations.Where(r => r.MechanicId == foundUser.Id && r.Status != "Done").Select(r => new ReparationDTO
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    MechanicId = r.MechanicId,
                    CarId = r.CarId,
                    Type = r.Type,
                    Description = r.Description,
                    Date = r.Date,
                    Status = r.Status,
                });
            }
            else
            {
                cars = _context.Cars.Select(c => new CarDTO
                {
                    Id = c.Id,
                    UserId = c.UserId,
                    Brand = c.Brand,
                    Model = c.Model,
                    FabricationYear = c.FabricationYear,
                    LicensePlate = c.LicensePlate
                });

                reparations = _context.Reparations.Select(r => new ReparationDTO
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    MechanicId = r.MechanicId,
                    CarId = r.CarId,
                    Type = r.Type,
                    Description = r.Description,
                    Date = r.Date,
                    Status = r.Status,
                });

                bills = _context.Bills.Select(b => new BillDTO
                {
                    Id = b.Id,
                    ReparationId = b.ReparationId,
                    UserId = b.UserId,
                    Date = b.Date,
                    Total = b.Total,
                });
            }

            var returnedUser = new LoggedUserDTO
            {
                Id = foundUser.Id,
                FirstName = foundUser.FirstName,
                LastName = foundUser.LastName,
                Email = foundUser.Email,
                PhoneNumber = foundUser.PhoneNumber,
                Password = foundUser.Password,
                Role = foundUser.Role,
                Cars = cars.ToList(),
                Reparations = reparations.ToList(),
                Bills = bills.ToList()
            };

            var token = _tokenService.GenerateToken(foundUser);
            return Ok(new { User = returnedUser, Token = token});
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] UserRegisterDTO request)
        {
            var users = _context.Users;

            if (users.Any(u => u.Email == request.Email))
            {
                return Conflict("This email is already used!");
            }

            var hashedPassword = _passwordHasherService.Hash(request.Password);
            var newUser = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Password = hashedPassword,
                Role = request.Role,
                Cars = new List<Car>(),
                Reparations = new List<Reparation>(),
                Bills = new List<Bill>()
            };

            users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet]
        public async Task<ActionResult<LoggedUserDTO>> GetLoggedInUser()
        {
            var email = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (email is null)
            {
                return NotFound();
            }

            var users = _context.Users;
            var foundUser = users.FirstOrDefault(u => u.Email == email);
            
            if (foundUser is null)
            {
                return NotFound();
            }

            IQueryable<CarDTO> cars = Enumerable.Empty<CarDTO>().AsQueryable();
            IQueryable<ReparationDTO> reparations = Enumerable.Empty<ReparationDTO>().AsQueryable();
            IQueryable<BillDTO> bills = Enumerable.Empty<BillDTO>().AsQueryable();

            if (foundUser.Role == "User")
            {
                cars = _context.Cars.Where(c => c.UserId == foundUser.Id).Select(c => new CarDTO
                {
                    Id = c.Id,
                    UserId = c.UserId,
                    Brand = c.Brand,
                    Model = c.Model,
                    FabricationYear = c.FabricationYear,
                    LicensePlate = c.LicensePlate
                });

                reparations = _context.Reparations.Where(r => r.UserId == foundUser.Id).Select(r => new ReparationDTO
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    MechanicId = r.MechanicId,
                    CarId = r.CarId,
                    Type = r.Type,
                    Description = r.Description,
                    Date = r.Date,
                    Status = r.Status,
                });

                bills = _context.Bills.Where(b => b.UserId == foundUser.Id).Select(b => new BillDTO
                {
                    Id = b.Id,
                    ReparationId = b.ReparationId,
                    UserId = b.UserId,
                    Date = b.Date,
                    Total = b.Total,
                });
            }
            else if (foundUser.Role == "Mechanic")
            {
                cars = _context.Cars.Select(c => new CarDTO
                {
                    Id = c.Id,
                    UserId = c.UserId,
                    Brand = c.Brand,
                    Model = c.Model,
                    FabricationYear = c.FabricationYear,
                    LicensePlate = c.LicensePlate
                });

                reparations = _context.Reparations.Where(r => r.MechanicId == foundUser.Id).Select(r => new ReparationDTO
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    MechanicId = r.MechanicId,
                    CarId = r.CarId,
                    Type = r.Type,
                    Description = r.Description,
                    Date = r.Date,
                    Status = r.Status,
                });
            }
            else
            {
                cars = _context.Cars.Select(c => new CarDTO
                {
                    Id = c.Id,
                    UserId = c.UserId,
                    Brand = c.Brand,
                    Model = c.Model,
                    FabricationYear = c.FabricationYear,
                    LicensePlate = c.LicensePlate
                });

                reparations = _context.Reparations.Select(r => new ReparationDTO
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    MechanicId = r.MechanicId,
                    CarId = r.CarId,
                    Type = r.Type,
                    Description = r.Description,
                    Date = r.Date,
                    Status = r.Status,
                });

                bills = _context.Bills.Select(b => new BillDTO
                {
                    Id = b.Id,
                    ReparationId = b.ReparationId,
                    UserId = b.UserId,
                    Date = b.Date,
                    Total = b.Total,
                });
            }

            var returnedUser = new LoggedUserDTO
            {
                Id = foundUser.Id,
                FirstName = foundUser.FirstName,
                LastName = foundUser.LastName,
                Email = foundUser.Email,
                PhoneNumber = foundUser.PhoneNumber,
                Password = foundUser.Password,
                Role = foundUser.Role,
                Cars = cars.ToList(),
                Reparations = reparations.ToList(),
                Bills = bills.ToList()
            };

            var token = _tokenService.GenerateToken(foundUser);
            return Ok(new { User = returnedUser, Token = token });
        }
    }
}
