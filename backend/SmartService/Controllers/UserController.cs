using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartService.Domain;
using SmartService.Domain.DTOs.SmartService.Domain.DTOs;
using SmartService.Domain.Entities;
using SmartService.Domain.Interfaces;

namespace SmartService.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IPasswordHasherService _passwordHasherService;

        public UserController(ApplicationDbContext context, IPasswordHasherService passwordHasherService)
        {
            _context = context;
            _passwordHasherService = passwordHasherService;
        }

        [HttpGet("Mechanics")]
        public async Task<ActionResult<IEnumerable<User>>> GetMechanics()
        {
            return await _context.Users.Where(u => u.Role == "Mechanic").ToListAsync();
        }


        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/User/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, [FromBody] UserUpdateDTO request)
        {
            if (id != request.Id)
            {
                return BadRequest();
            }

            var oldUser =  _context.Users.FirstOrDefault(u => u.Id == id);

            if (!_passwordHasherService.Verify(oldUser.Password, request.Password))
            { 
                return BadRequest("Wrong password!");
            }
            if (_context.Users.Any(u => u.Email == request.Email && u.Id != id))
            {
                return Conflict("Email already used!");
            }

            _context.Entry(oldUser).State = EntityState.Detached;

            var newUser = new User
            {
                Id = id,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Password = oldUser.Password,
                Role = request.Role
            };

            _context.Entry(newUser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/User
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
