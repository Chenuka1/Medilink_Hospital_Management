
/*using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using webapplication3.Data;
using webapplication3.Models;

namespace webapplication3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public LoginController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            if (model == null)
                return BadRequest("Invalid client request");

            // Check if the user is a patient
            var patient = _context.patientModel
                .FirstOrDefault(u => u.email == model.Email && u.password == model.Password);

            if (patient != null)
            {
                var token = GenerateJwtToken(patient.email, "patient");
                return Ok(new
                {
                    Message = "Login successful",
                    patient_id = patient.patient_id,
                    full_name = patient.full_name,
                    contact = patient.contact,
                    Role = "patient",
                    Token = token
                });
            }

            // Check if the user is a doctor
            var doctor = _context.doctorModel
                .FirstOrDefault(u => u.email == model.Email && u.password == model.Password);

            if (doctor != null)
            {
                var token = GenerateJwtToken(doctor.email, "doctor");
                return Ok(new
                {
                    Message = "Login successful",
                    doctor_id = doctor.doctor_id,
                    doctor_name = doctor.doctor_name,
                    Role = "doctor",
                    Token = token
                });
            }

            // If no user was found, return unauthorized
            return Unauthorized("Incorrect email or password.");
        }

        private string GenerateJwtToken(string email, string role)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role)
            };

            var token = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}*/


using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Numerics;
using System.Security.Claims;
using System.Text;
using webapplication3.Data;
using webapplication3.Models;

namespace webapplication3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public LoginController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginModel login)
        {
            if (login == null || string.IsNullOrEmpty(login.Username) || string.IsNullOrEmpty(login.Password))
            {
                return BadRequest("Invalid login request");
            }

            // Check if the user exists
            var user = _context.MED_USER_DETAILS
                        .FirstOrDefault(u => u.MUD_USER_NAME == login.Username && u.MUD_PASSWORD == login.Password);

            if (user == null)
            {
                return Unauthorized("Invalid credentials");
            }

            // Generate the JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:SecretKey"]); // Secret key from config

            // Add claims (e.g., username and role)
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.MUD_USER_NAME),
                new Claim(ClaimTypes.Role, user.MUD_USER_TYPE) // Adding user role as a claim
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1), // Token expiration
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            /*return Ok(new { Token = tokenString });*/

            return Ok(new
            {
                Message = "Login successful",
                Role = user.MUD_USER_TYPE, // Include the user's role
                Token = tokenString
            });
        }

        public class LoginModel
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }
    }
}




