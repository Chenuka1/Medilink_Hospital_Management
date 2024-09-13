﻿using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using webapplication3.Models;
using Microsoft.EntityFrameworkCore;
using webapplication3.Data;

namespace webapplication3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserTypeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserTypeController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/UserType
        [HttpPost]
        public async Task<ActionResult<MED_USER_TYPES>> PostUserType(MED_USER_TYPES userType)
        {
            if (userType == null)
            {
                return BadRequest();
            }

            _context.MED_USER_TYPES.Add(userType);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserTypeById), new { id = userType.MUT_USER_TYPE }, userType);
        }

        // GET: api/UserType/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<MED_USER_TYPES>> GetUserTypeById(string id)
        {
            var userType = await _context.MED_USER_TYPES.FindAsync(id);

            if (userType == null)
            {
                return NotFound();
            }

            return userType;
        }
    }
}
