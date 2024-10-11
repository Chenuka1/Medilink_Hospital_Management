/*using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using webapplication3.Data;

namespace webapplication3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppoinmentLoginController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AppoinmentLoginController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("Login")]
        public IActionResult Login([FromBody] AppoinmentLoginModel login)
        {
            if (login == null || string.IsNullOrEmpty(login.email) || string.IsNullOrEmpty(login.password))
            {
                return BadRequest("Invalid login request");
            }

            // Check if the user exists
            var user = _context.MED_APPOINMENT_USERS
                        .FirstOrDefault(u => u.MAU_EMAIL == login.email && u.MAU_PASSWORD == login.password);

            if (user == null)
            {
                return Unauthorized("Invalid credentials");
            }

            // Generate the JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:SecretKey"]); // Secret key from config

            // Add claims (e.g., email)
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.MAU_EMAIL),
                // Optionally add role claim here if available
                new Claim(ClaimTypes.Role, "patient") // Replace 'patient' with user role from DB if needed
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1), // Token expiration
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new
            {
                Message = "Login successful",
                Role = "patient", // Change to actual role if dynamic
                Token = tokenString,
                Email = login.email
            });
        }
    }

    // Model class definition
    public class AppoinmentLoginModel
    {
        public string email { get; set; }
        public string password { get; set; }
    }
}
*/
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using webapplication3.Data;

namespace webapplication3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppoinmentLoginController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AppoinmentLoginController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("Login")]
        public IActionResult Login([FromBody] AppoinmentLoginModel login)
        {
            if (login == null || string.IsNullOrEmpty(login.email) || string.IsNullOrEmpty(login.password))
            {
                return BadRequest("Invalid login request");
            }

            // Check if the user exists
            var user = _context.MED_PATIENTS_DETAILS
                        .FirstOrDefault(u => u.MPD_EMAIL == login.email && u.MPD_PASSWORD == login.password);

            if (user == null)
            {
                return Unauthorized("Invalid credentials");
            }

            // Generate the JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:SecretKey"]); // Secret key from config

            // Add claims (e.g., email)
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.MPD_EMAIL),
                // Optionally add role claim here if available
                new Claim(ClaimTypes.Role, "patient") // Replace 'patient' with user role from DB if needed
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1), // Token expiration
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new
            {
                Message = "Login successful",
                Role = "patient", // Change to actual role if dynamic
                Token = tokenString,
                Email = login.email
            });
        }
    }

    // Model class definition
    public class AppoinmentLoginModel
    {
        public string email { get; set; }
        public string password { get; set; }
    }
}
