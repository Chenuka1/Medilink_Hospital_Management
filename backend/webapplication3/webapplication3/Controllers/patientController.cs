using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapplication3.Data;
using webapplication3.Models;

namespace webapplication3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PatientController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Patient
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MED_PATIENTS_DETAILS>>> GetPatients()
        {
            return await _context.MED_PATIENTS_DETAILS.ToListAsync();
        }

        // GET: api/Patient/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<MED_PATIENTS_DETAILS>> GetPatientById(string id)
        {
            var patient = await _context.MED_PATIENTS_DETAILS.FindAsync(id);

            if (patient == null)
            {
                return NotFound();
            }

            return Ok(patient);
        }
        [HttpPost]
        public async Task<ActionResult<MED_PATIENTS_DETAILS>> PostPatient(MED_PATIENTS_DETAILS patient)
        {
            string newPatientId;
            try
            {
                // Use a transaction to handle concurrency
                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    var lastPatient = await _context.MED_PATIENTS_DETAILS
                        .OrderByDescending(p => p.MPD_PATIENT_CODE)
                        .FirstOrDefaultAsync();

                    if (lastPatient == null)
                    {
                        newPatientId = "PA1";
                    }
                    else
                    {
                        string lastId = lastPatient.MPD_PATIENT_CODE;
                        string prefix = lastId.Substring(0, 2); // Extract prefix
                        string numericPartStr = lastId.Substring(2); // Extract numeric part

                        if (int.TryParse(numericPartStr, out int numericPart))
                        {
                            // Determine the length of the numeric part
                            int newNumericPart = numericPart + 1;
                            int length = numericPartStr.Length;
                            // Ensure zero-padding for the numeric part
                            newPatientId = prefix + newNumericPart.ToString("D" + length);
                        }
                        else
                        {
                            return Conflict("Patient ID format is invalid.");
                        }
                    }

                    // Check if the generated ID already exists
                    if (await _context.MED_PATIENTS_DETAILS.AnyAsync(p => p.MPD_PATIENT_CODE == newPatientId))
                    {
                        // Retry generating a new ID or return an error if ID is still not unique
                        return Conflict("A patient with this ID already exists.");
                    }

                    patient.MPD_PATIENT_CODE = newPatientId;
                    _context.MED_PATIENTS_DETAILS.Add(patient);
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
            }
            catch (DbUpdateException)
            {
                // Handle the case where the ID generation logic still results in a duplicate
                return Conflict("A patient with this ID already exists.");
            }
            catch (Exception ex)
            {
                // Handle unexpected exceptions
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return CreatedAtAction(nameof(GetPatientById), new { id = patient.MPD_PATIENT_CODE }, patient);
        }






        // PUT: api/Patient/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatient(string id, MED_PATIENTS_DETAILS patient)
        {
            if (id != patient.MPD_PATIENT_CODE)
            {
                return BadRequest();
            }

            _context.Entry(patient).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientExists(id))
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

        // DELETE: api/Patient/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(string id)
        {
            var patient = await _context.MED_PATIENTS_DETAILS.FindAsync(id);
            if (patient == null)
            {
                return NotFound();
            }

            _context.MED_PATIENTS_DETAILS.Remove(patient);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Patient/SearchByContact/{contact}
        [HttpGet("SearchByContact/{contact}")]
        public async Task<ActionResult<IEnumerable<MED_PATIENTS_DETAILS>>> SearchByContact(string contact)
        {
            var patients = await _context.MED_PATIENTS_DETAILS
                .Where(p => p.MPD_MOBILE_NO == contact)
                .ToListAsync();

            if (patients == null || !patients.Any())
            {
                return NotFound();
            }

            return Ok(patients);
        }


        private bool PatientExists(string id)
        {
            return _context.MED_PATIENTS_DETAILS.Any(e => e.MPD_PATIENT_CODE == id);
        }
    }
}
