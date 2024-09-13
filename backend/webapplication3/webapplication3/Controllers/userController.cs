using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using webapplication3.Data;
using webapplication3.Models;

namespace webapplication3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/User
        [HttpPost]
        public async Task<ActionResult<MED_USER_DETAILS>> PostUser(MED_USER_DETAILS userDetails)
        {
            if (userDetails == null)
            {
                return BadRequest();
            }

            // Generate the new ID
            userDetails.MUD_USER_ID = await GenerateUserIdAsync();

            _context.MED_USER_DETAILS.Add(userDetails);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserById), new { id = userDetails.MUD_USER_ID }, userDetails);
        }

        // GET: api/User/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<MED_USER_DETAILS>> GetUserById(string id)
        {
            var userDetails = await _context.MED_USER_DETAILS
                .FirstOrDefaultAsync(ud => ud.MUD_USER_ID == id);

            if (userDetails == null)
            {
                return NotFound();
            }

            return userDetails;
        }

        // Helper method to generate user ID
        private async Task<string> GenerateUserIdAsync()
        {
            var lastUser = await _context.MED_USER_DETAILS
                .OrderByDescending(u => u.MUD_USER_ID)
                .FirstOrDefaultAsync();

            if (lastUser == null)
            {
                return "us1"; // Start from us1 if no users exist
            }

            string lastId = lastUser.MUD_USER_ID;
            int lastNumber = int.Parse(lastId.Substring(2)); // Extract the number part

            // Increment and return the new ID without leading zeros
            return $"us{(lastNumber + 1)}";
        }
    }
}
