using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartService.Domain;
using SmartService.Domain.DTOs;
using SmartService.Domain.Entities;

namespace SmartService.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CarController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CarController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Car
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CarDTO>>> GetCars()
        {
            IQueryable<CarDTO> cars = _context.Cars.Select(c => new CarDTO
            {
                Id = c.Id,
                UserId = c.UserId,
                Brand = c.Brand,
                Model = c.Model,
                FabricationYear = c.FabricationYear,
                LicensePlate = c.LicensePlate
            });

            return cars.ToList();
        }

        // GET: api/Car/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Car>> GetCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
            {
                return NotFound();
            }

            return car;
        }

        // PUT: api/Car/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCar(int id, [FromBody] CarDTO request)
        {
            if (id != request.Id)
            {
                return BadRequest();
            }

            var oldCar = _context.Cars.FirstOrDefault(c => c.Id == id);

            if (_context.Cars.Any(c => c.LicensePlate == request.LicensePlate && c.UserId != request.UserId))
            {
                return Conflict("License plate number already used!");
            }

            _context.Entry(oldCar).State = EntityState.Detached;

            var newCar = new Car
            {
                Id = id,
                UserId = request.UserId,
                Brand = request.Brand,
                Model = request.Model,
                FabricationYear = request.FabricationYear,
                LicensePlate = request.LicensePlate,
            };

            _context.Entry(newCar).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CarExists(id))
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

        // POST: api/Car
        [HttpPost]
        public async Task<ActionResult<Car>> PostCar(CarCreateDTO request)
        {
            var car = new Car
            {
                UserId = request.UserId,
                Brand = request.Brand,
                Model = request.Model,
                FabricationYear = request.FabricationYear,
                LicensePlate = request.LicensePlate,
            };

            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCar", new { id = car.Id }, car);
        }

        // DELETE: api/Car/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car == null)
            {
                return NotFound();
            }

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CarExists(int id)
        {
            return _context.Cars.Any(e => e.Id == id);
        }
    }
}
