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
    public class ReparationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReparationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Reparation
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reparation>>> GetReparations()
        {
            return await _context.Reparations.ToListAsync();
        }

        // GET: api/Reparation/Mechanic
        [HttpGet("Mechanic/{id}")]
        public async Task<ActionResult<IEnumerable<ReparationDTO>>> GetMechanicReparations(int id)
        {

            IQueryable<ReparationDTO> reparations = _context.Reparations.Where(r => r.MechanicId == id && r.Status != "Done").Select(r => new ReparationDTO
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

            return reparations.ToList();
        }

        // GET: api/Reparation/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Reparation>> GetReparation(int id)
        {
            var reparation = await _context.Reparations.FindAsync(id);

            if (reparation == null)
            {
                return NotFound();
            }

            return reparation;
        }

        // PUT: api/Reparation/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReparation(int id, ReparationDTO request)
        {
            if (id != request.Id)
            {
                return BadRequest();
            }

            var oldReparation = _context.Reparations.FirstOrDefault(r => r.Id == id);

            _context.Entry(oldReparation).State = EntityState.Detached;

            var newReparation = new Reparation
            {
                Id = id,
                UserId = request.UserId,
                MechanicId = request.MechanicId,
                CarId = request.CarId,
                Type = request.Type,
                Description = request.Description,
                Date = request.Date,
                Status = request.Status,
            };

            _context.Entry(newReparation).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReparationExists(id))
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

        // POST: api/Reparation
        [HttpPost]
        public async Task<ActionResult<ReparationDTO>> PostReparation(ReparationCreateDTO request)
        {
            var reparation = new Reparation
            {
                UserId = request.UserId,
                MechanicId = request.MechanicId,
                CarId = request.CarId,
                Type = request.Type,
                Description = request.Description,
                Date = request.Date,
                Status = request.Status,
            };

            _context.Reparations.Add(reparation);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReparation", new { Id = reparation.Id }, reparation);
        }

        // DELETE: api/Reparation/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReparation(int id)
        {
            var reparation = await _context.Reparations.FindAsync(id);
            if (reparation == null)
            {
                return NotFound();
            }

            _context.Reparations.Remove(reparation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ReparationExists(int id)
        {
            return _context.Reparations.Any(e => e.Id == id);
        }
    }
}
