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
    public class TreatmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TreatmentController(ApplicationDbContext context)
        {
            _context = context;
        }




        // GET: api/treatment/{patientId}/{serialNo}
        [HttpGet("{patientId}/{serialNo}")]
        public async Task<ActionResult<MED_TREATMENT_DETAILS>> GetById(string patientId, int serialNo)
        {
            var treatment = await _context.MED_TREATMENT_DETAILS
                                          .FirstOrDefaultAsync(t => t.MTD_PATIENT_CODE == patientId && t.MTD_SERIAL_NO == serialNo);

            if (treatment == null)
            {
                return NotFound();
            }

            return Ok(treatment);
        }


        // POST: api/treatment
        [HttpPost]
        public async Task<ActionResult<MED_TREATMENT_DETAILS>> PostTreatment(MED_TREATMENT_DETAILS treatment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.MED_TREATMENT_DETAILS.Add(treatment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { patientId = treatment.MTD_PATIENT_CODE, serialNo = treatment.MTD_SERIAL_NO }, treatment);
        }



        // GET: api/treatment/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<MED_TREATMENT_DETAILS>> GetById(int id)
        {
            var treatment = await _context.MED_TREATMENT_DETAILS.FindAsync(id);

            if (treatment == null)
            {
                return NotFound();
            }

            return Ok(treatment);
        }

        // GET: api/treatment/patient/{patientId}
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<MED_TREATMENT_DETAILS>>> GetTreatmentsByPatientId(string patientId)
        {
            var treatments = await _context.MED_TREATMENT_DETAILS
                                           .Where(t => t.MTD_PATIENT_CODE == patientId)
                                           .ToListAsync();

            if (treatments == null || treatments.Count == 0)
            {
                return NotFound();
            }

            return Ok(treatments);
        }



        [HttpGet("match/{patientId}/{serialNo}")]
        public async Task<IActionResult> GetMatchedRecords(string patientId, int serialNo)
        {
            var result = await (
                                from d in _context.MED_DRUGS_DETAILS
                                join t in _context.MED_TREATMENT_DETAILS
                                on new { PatientCode = (string)d.MDD_PATIENT_CODE, SerialNo = (int)d.MDD_SERIAL_NO }
                                equals new { PatientCode = (string)t.MTD_PATIENT_CODE, SerialNo = (int)t.MTD_SERIAL_NO }
                                where t.MTD_PATIENT_CODE == patientId && t.MTD_SERIAL_NO == serialNo
                                select new
                                {
                                    t.MTD_PATIENT_CODE,
                                    t.MTD_SERIAL_NO,
                                    t.MTD_DATE,
                                    t.MTD_DOCTOR,
                                    t.MTD_TYPE,
                                    t.MTD_COMPLAIN,
                                    t.MTD_DIAGNOSTICS,
                                    t.MTD_REMARKS,
                                    t.MTD_AMOUNT,
                                    t.MTD_PAYMENT_STATUS,
                                    t.MTD_TREATMENT_STATUS,
                                    d.MDD_MATERIAL_CODE,
                                    d.MDD_QUANTITY,
                                    d.MDD_RATE,
                                    d.MDD_AMOUNT,
                                    d.MDD_DOSAGE,
                                    d.MDD_TAKES,
                                    d.MDD_GIVEN_QUANTITY,
                                    d.MDD_STATUS
                                }).ToListAsync();

            if (!result.Any())
            {
                return NotFound("No matching records found.");
            }

            return Ok(result);
        }


        [HttpGet("preparationcomplete/")]
        public async Task<IActionResult> GetPreparationCompleteDetails()
        {
            var result = await (from t in _context.MED_TREATMENT_DETAILS
                                join p in _context.MED_PATIENTS_DETAILS
                                on t.MTD_PATIENT_CODE equals p.MPD_PATIENT_CODE
                                where t.MTD_TREATMENT_STATUS == "P" // Filter for treatment status 'P'
                                select new
                                {
                                    // Patient details
                                    p.MPD_PATIENT_CODE,
                                    p.MPD_PATIENT_NAME,
                                    p.MPD_MOBILE_NO,
                                    p.MPD_NIC_NO
                                   /* p.MPD_CITY,
                                    p.MPD_ADDRESS,
                                    p.MPD_GUARDIAN,
                                    p.MPD_GUARDIAN_CONTACT_NO,
                                    p.MPD_birthdate*/,

                                    // Treatment details
                                    t.MTD_SERIAL_NO,
                                    t.MTD_DATE,
                                    t.MTD_DOCTOR,
                                    t.MTD_TYPE,
                                    t.MTD_COMPLAIN,
                                    t.MTD_DIAGNOSTICS,
                                    t.MTD_REMARKS,
                                    t.MTD_AMOUNT,
                                    t.MTD_PAYMENT_STATUS,
                                    t.MTD_TREATMENT_STATUS
                                }).ToListAsync();

            if (!result.Any())
            {
                return NotFound("No patients found with treatment preparation status 'P'.");
            }

            return Ok(result);
        }


        [HttpPatch("update/status/{patientId}/{serialNo}")]
        public async Task<IActionResult> UpdateTreatmentStatus(string patientId, int serialNo)
        {
            var treatment = await _context.MED_TREATMENT_DETAILS
                                          .FirstOrDefaultAsync(t => t.MTD_PATIENT_CODE == patientId && t.MTD_SERIAL_NO == serialNo);

            if (treatment == null)
            {
                return NotFound();
            }

            // Update the status to "C"
            treatment.MTD_TREATMENT_STATUS = "C";
            await _context.SaveChangesAsync();

            return NoContent(); // Return a 204 No Content response
        }












        [HttpGet("patient/record/{patientId}/{serialNo}")]
        public async Task<IActionResult> GetTreatmentRecord(string patientId, int serialNo)
        {
            var treatmentQuery = from t in _context.MED_TREATMENT_DETAILS
                                 where t.MTD_PATIENT_CODE == patientId && t.MTD_SERIAL_NO == serialNo
                                 select t;

            var drugsQuery = from d in _context.MED_DRUGS_DETAILS
                             where d.MDD_PATIENT_CODE == patientId && d.MDD_SERIAL_NO == serialNo
                             join m in _context.MED_MATERIAL_CATALOGUE
                             on d.MDD_MATERIAL_CODE equals m.MMC_MATERIAL_CODE
                             select new
                             {
                                 d.MDD_MATERIAL_CODE,
                                 d.MDD_QUANTITY,
                                 d.MDD_RATE,
                                 d.MDD_AMOUNT,
                                 d.MDD_DOSAGE,
                                 d.MDD_TAKES,
                                 d.MDD_GIVEN_QUANTITY,
                                 d.MDD_STATUS,
                                 DrugName = m.MMC_DESCRIPTION
                             };

            var treatmentRecord = await (from t in treatmentQuery
                                         select new
                                         {
                                             t.MTD_PATIENT_CODE,
                                             t.MTD_SERIAL_NO,
                                             t.MTD_DATE,
                                             t.MTD_DOCTOR,
                                             t.MTD_TYPE,
                                             t.MTD_COMPLAIN,
                                             t.MTD_DIAGNOSTICS,
                                             t.MTD_REMARKS,
                                             t.MTD_AMOUNT,
                                             t.MTD_TREATMENT_STATUS,
                                             Drugs = drugsQuery.ToList()
                                         }).FirstOrDefaultAsync();

            if (treatmentRecord == null)
            {
                return NotFound("Treatment record not found.");
            }

            return Ok(treatmentRecord);
        }




    }
}