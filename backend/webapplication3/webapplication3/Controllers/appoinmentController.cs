

using Microsoft.AspNetCore.Mvc;
using webapplication3.Data;
using webapplication3.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace webapplication3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AppointmentController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<MED_APPOINMENT_DETAILS>> PostAppointment(MED_APPOINMENT_DETAILS appointment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.MED_APPOINMENT_DETAILS.Add(appointment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAppointmentById), new { id = appointment.MAD_APPOINMENT_ID }, appointment);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MED_APPOINMENT_DETAILS>> GetAppointmentById(int id)
        {
            var appointment = await _context.MED_APPOINMENT_DETAILS.FindAsync(id);

            if (appointment == null)
            {
                return NotFound();
            }

            return appointment;
        }

  

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MED_APPOINMENT_DETAILS>>> GetAllAppointments()
        {
            var appointments = await _context.MED_APPOINMENT_DETAILS.ToListAsync();

            if (appointments == null || !appointments.Any())
            {
                return NotFound("No appointments found.");
            }

            return Ok(appointments);
        }
    }
}
