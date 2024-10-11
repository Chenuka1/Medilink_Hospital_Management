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
        public async Task<IActionResult> AddPatient([FromBody] MED_PATIENTS_DETAILS patient)
        {
            // Start transaction for ID generation and saving patient details
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Ensure the ID starts with "PA" followed by a 4-digit number
                    string prefix = "PA";
                    string newPatientId;

                    // Retrieve the last patient ID to increment the numeric part
                    var lastPatient = await _context.MED_PATIENTS_DETAILS
                        .OrderByDescending(p => p.MPD_PATIENT_CODE)
                        .FirstOrDefaultAsync();

                    if (lastPatient != null && lastPatient.MPD_PATIENT_CODE.StartsWith(prefix))
                    {
                        // Extract the numeric part of the last patient ID and increment it
                        var numericPart = lastPatient.MPD_PATIENT_CODE.Substring(prefix.Length);
                        if (int.TryParse(numericPart, out int newNumericPart))
                        {
                            newNumericPart++; // Increment the numeric part
                            newPatientId = prefix + newNumericPart.ToString("D4"); // Ensure zero-padding to 4 digits
                        }
                        else
                        {
                            return Conflict("Patient ID format is invalid.");
                        }
                    }
                    else
                    {
                        // If there is no last patient or the format doesn't match, start from PA0001
                        newPatientId = prefix + "0001";
                    }

                    // Check if the generated ID already exists
                    if (await _context.MED_PATIENTS_DETAILS.AnyAsync(p => p.MPD_PATIENT_CODE == newPatientId))
                    {
                        // Retry generating a new ID or return an error if ID is still not unique
                        return Conflict("A patient with this ID already exists.");
                    }

                    // Assign the generated patient ID to the new patient
                    patient.MPD_PATIENT_CODE = newPatientId;
                    _context.MED_PATIENTS_DETAILS.Add(patient);
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
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
            }

            // Return the newly created patient with their ID
            return CreatedAtAction(nameof(GetPatientById), new { id = patient.MPD_PATIENT_CODE }, patient);
        }



        // PUT: api/Patient/{id}
        /*[HttpPut("{id}")]
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
        }*/


        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatient(string id, [FromForm] MED_PATIENTS_DETAILS patient, IFormFile? profileImage)
        {
            if (id != patient.MPD_PATIENT_CODE)
            {
                return BadRequest();
            }

            if (profileImage != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await profileImage.CopyToAsync(memoryStream);
                    patient.MPD_PHOTO = memoryStream.ToArray(); // Store the image as a byte array
                }
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



        [HttpGet("patient/findbyemail")]
        public async Task<IActionResult> FindPatientByEmail(string email)
        {
            var patient = await _context.MED_PATIENTS_DETAILS
                .Where(p => p.MPD_EMAIL == email)
                .FirstOrDefaultAsync(); 

            if (patient == null)
            {
                return NotFound(); 
            }

            return Ok(patient);
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
