using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapplication3.Data;
using webapplication3.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace webapplication3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DrugController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DrugController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Drug
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MED_DRUGS_DETAILS>>> GetDrugs()
        {
            return await _context.MED_DRUGS_DETAILS.ToListAsync();
        }

        // GET: api/Drugdetails/{patientcode}
        [HttpGet("Drugdetails/{patientcode}")]
        public async Task<ActionResult<IEnumerable<MED_DRUGS_DETAILS>>> GetDrugDetailsByPatientCode(string patientcode)
        {
            var drugs = await _context.MED_DRUGS_DETAILS
                                      .Where(d => d.MDD_PATIENT_CODE == patientcode)
                                      .ToListAsync();

            if (drugs == null || drugs.Count == 0)
            {
                return NotFound();
            }

            return Ok(drugs);
        }




        // GET: api/Drug/{patientCode}/{serialNo}/{materialCode}
        [HttpGet("{patientCode}/{serialNo}/{materialCode}")]
        public async Task<ActionResult<MED_DRUGS_DETAILS>> GetDrug(string patientCode, int serialNo, string materialCode)
        {
            var drug = await _context.MED_DRUGS_DETAILS
                .FindAsync(patientCode, serialNo, materialCode);

            if (drug == null)
            {
                return NotFound();
            }

            return drug;
        }

        // POST: api/Drug
        [HttpPost]
        public async Task<ActionResult<MED_DRUGS_DETAILS>> PostDrug(MED_DRUGS_DETAILS drug)
        {
            _context.MED_DRUGS_DETAILS.Add(drug);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDrug), new
            {
                patientCode = drug.MDD_PATIENT_CODE,
                serialNo = drug.MDD_SERIAL_NO,
                materialCode = drug.MDD_MATERIAL_CODE
            }, drug);
        }

        // PUT: api/Drug/{patientCode}/{serialNo}/{materialCode}
        [HttpPut("{patientCode}/{serialNo}/{materialCode}")]
        public async Task<IActionResult> PutDrug(string patientCode, int serialNo, string materialCode, MED_DRUGS_DETAILS drug)
        {
            if (patientCode != drug.MDD_PATIENT_CODE || serialNo != drug.MDD_SERIAL_NO || materialCode != drug.MDD_MATERIAL_CODE)
            {
                return BadRequest();
            }

            _context.Entry(drug).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DrugExists(patientCode, serialNo, materialCode))
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

        // DELETE: api/Drug/{patientCode}/{serialNo}/{materialCode}
        [HttpDelete("{patientCode}/{serialNo}/{materialCode}")]
        public async Task<IActionResult> DeleteDrug(string patientCode, int serialNo, string materialCode)
        {
            var drug = await _context.MED_DRUGS_DETAILS
                .FindAsync(patientCode, serialNo, materialCode);
            if (drug == null)
            {
                return NotFound();
            }

            _context.MED_DRUGS_DETAILS.Remove(drug);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DrugExists(string patientCode, int serialNo, string materialCode)
        {
            return _context.MED_DRUGS_DETAILS.Any(e => e.MDD_PATIENT_CODE == patientCode && e.MDD_SERIAL_NO == serialNo && e.MDD_MATERIAL_CODE == materialCode);
        }
    }
}
