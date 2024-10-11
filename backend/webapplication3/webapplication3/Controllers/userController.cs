using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using webapplication3.Data;
using webapplication3.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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

        [HttpPost]
        public async Task<ActionResult<MED_USER_DETAILS>> PostUser([FromForm] MED_USER_DETAILS userDetails, [FromForm] IFormFile? profileImage)
        {
            if (userDetails == null)
            {
                return BadRequest("User details cannot be null.");
            }

            // Generate the new ID
            userDetails.MUD_USER_ID = await GenerateUserIdAsync();

            // Set created and updated date
            userDetails.MUD_CREATED_DATE = DateTime.UtcNow;
           

            // Handle the profile image only if provided
            if (profileImage != null && profileImage.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var filePath = Path.Combine(uploadsFolder, profileImage.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await profileImage.CopyToAsync(stream);
                }
                userDetails.MUD_PROFILE_IMAGE = filePath; // Save the path to the database
            }
            else
            {
                userDetails.MUD_PROFILE_IMAGE = null; // No image uploaded
            }

            
            _context.MED_USER_DETAILS.Add(userDetails);
           await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserById), new { id = userDetails.MUD_USER_ID }, userDetails);
        }

        [HttpGet("doctorname/specialization")]
        public async Task<ActionResult<MED_USER_DETAILS>> GetDoctors(string? name, string? specialization)
        {
            // Correct LINQ query with logical OR
            var users = await _context.MED_USER_DETAILS
                .Where(d => d.MUD_USER_NAME == name || d.MUD_SPECIALIZATION == specialization)
                .ToListAsync();

            if (!users.Any())
            {
                return NotFound("No doctors found with the provided name or specialization.");
            }

            return Ok(users);
        }









        // GET: api/User/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<MED_USER_DETAILS>> GetUserById(string id)
        {
            var userDetails = await _context.MED_USER_DETAILS
                .FirstOrDefaultAsync(ud => ud.MUD_USER_ID == id);

            if (userDetails == null)
            {
                return NotFound("User not found.");
            }

            return userDetails;
        }

        // Helper method to generate user ID
        // Helper method to generate user ID
        private async Task<string> GenerateUserIdAsync()
        {
            var lastUser = await _context.MED_USER_DETAILS
                .OrderByDescending(u => u.MUD_USER_ID)
                .FirstOrDefaultAsync();

            if (lastUser == null)
            {
                return "User001"; 
            }

            string lastId = lastUser.MUD_USER_ID;
            int lastNumber = int.Parse(lastId.Substring(4)); // Extract the number part after "User"

           
            return $"User{(lastNumber + 1).ToString("D3")}";
        }



        // GET: api/User/suggest?query={username}
        [HttpGet("suggest")]
        public async Task<ActionResult<IEnumerable<string>>> GetUsernameSuggestions(string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest("Query parameter is required.");
            }

            var usernames = await _context.MED_USER_DETAILS
                .Where(u => u.MUD_USER_NAME.Contains(query))
                .Select(u => u.MUD_USER_NAME)
                .Take(10) 
                .ToListAsync();

            if (usernames == null || usernames.Count == 0)
            {
                return NotFound("No matching usernames found.");
            }

            return Ok(usernames);
        }

        



        







    }
}
