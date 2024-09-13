﻿using Microsoft.EntityFrameworkCore;
using webapplication3.Models; // Adjust the namespace according to your project structure

namespace webapplication3.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<med_doctor_details> med_doctor_details { get; set; }
       
       


        public DbSet<MED_TIMESLOT> MED_TIMESLOT { get; set; }
        public DbSet<med_patient> med_patient { get; set; }
        public DbSet<MED_PATIENTS_DETAILS> MED_PATIENTS_DETAILS { get; set; }
        public DbSet<MED_TREATMENT_DETAILS> MED_TREATMENT_DETAILS { get; set; }
        public DbSet<MED_MATERIAL_CATALOGUE> MED_MATERIAL_CATALOGUE { get; set; }
        public DbSet<MED_DRUGS_DETAILS> MED_DRUGS_DETAILS { get; set; }
        public DbSet<MED_USER_TYPES> MED_USER_TYPES { get;set; }

        public DbSet<MED_APPOINMENT_DETAILS> MED_APPOINMENT_DETAILS { get; set; }

        public DbSet<MED_USER_DETAILS> MED_USER_DETAILS { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MED_TREATMENT_DETAILS>()
                .HasKey(m => new { m.MTD_PATIENT_CODE, m.MTD_SERIAL_NO });

            modelBuilder.Entity<MED_DRUGS_DETAILS>()
                .HasKey(m => new { m.MDD_PATIENT_CODE, m.MDD_SERIAL_NO, m.MDD_MATERIAL_CODE });

            
        }
    }
}
