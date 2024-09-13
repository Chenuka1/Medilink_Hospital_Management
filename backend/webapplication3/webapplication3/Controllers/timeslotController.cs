using Microsoft.AspNetCore.Mvc;
using webapplication3.Data;
using webapplication3.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace webapplication3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimeslotController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TimeslotController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Timeslot/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MED_TIMESLOT>> GetTimeslot(int id)
        {
            var timeslot = await _context.MED_TIMESLOT.FindAsync(id);

            if (timeslot == null)
            {
                return NotFound();
            }

            return Ok(timeslot);
        }

        // GET: api/Timeslot
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MED_TIMESLOT>>> GetAllTimeslots()
        {
            var timeslots = await _context.MED_TIMESLOT.ToListAsync();
            return Ok(timeslots);
        }

        // POST: api/Timeslot
        [HttpPost]
        public async Task<ActionResult<MED_TIMESLOT>> PostTimeslot(MED_TIMESLOT timeslot)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.MED_TIMESLOT.Add(timeslot);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTimeslot), new { id = timeslot.MT_SLOT_ID }, timeslot);
        }

        // DELETE: api/Timeslot/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTimeslot(int id)
        {
            var timeslot = await _context.MED_TIMESLOT.FindAsync(id);

            if (timeslot == null)
            {
                return NotFound();
            }

            _context.MED_TIMESLOT.Remove(timeslot);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /*// PATCH: api/Timeslot/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchTimeslot(int id)
        {
            var timeslot = await _context.MED_TIMESLOT.FindAsync(id);

            if (timeslot == null)
            {
                return NotFound();
            }

            // Add 15 minutes to the timeslot
            var newTimeslot = timeslot.MT_TIMESLOT.Add(new TimeSpan(0, 15, 0));

            // Check if the updated timeslot is equal to or greater than the end time
            if (newTimeslot >= timeslot.MT_END_TIME)
            {
                // If the new timeslot reaches or exceeds the end time, remove the current timeslot
                _context.MED_TIMESLOT.Remove(timeslot);
                await _context.SaveChangesAsync();

                return BadRequest("Appointments are finished. No further slots available.");
            }

            // If the timeslot is valid, update the current timeslot and increment the seat number
            timeslot.MT_TIMESLOT = newTimeslot;
            timeslot.MT_SEAT_NUMBER += 1;

            _context.Entry(timeslot).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TimeslotExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }*/

        /*
                [HttpPatch("{id}")]
                public async Task <IActionResult>Patchseatnum(int id)
                {

                    var timeslot = await _context.MED_TIMESLOT.FindAsync(id);

                    if (timeslot == null)
                    {


                        return NOtFound();



                    }


                }*/

        [HttpPatch("{id}/incrementSeat")]
        public async Task<IActionResult> Patchseatnum(int id)
        {
            // Find the timeslot by ID
            var timeslot = await _context.MED_TIMESLOT.FindAsync(id);

            if (timeslot == null)
            {
                return NotFound();
            }

           
            if (timeslot.MT_MAXIMUM_PATIENTS.HasValue && timeslot.MT_SEAT_NUMBER >= timeslot.MT_MAXIMUM_PATIENTS)
            {
                return BadRequest("No more seats available.");
            }

            // Increment the seat number
            timeslot.MT_SEAT_NUMBER += 1;

            // Mark the timeslot as modified
            _context.Entry(timeslot).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TimeslotExists(id))
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





        private bool TimeslotExists(int id)
        {
            return _context.MED_TIMESLOT.Any(e => e.MT_SLOT_ID == id);
        }
    }
}
