using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapplication3.Models
{
    public class MED_USER_DETAILS
    {
        [Key]
        [StringLength(7)]
        public string MUD_USER_ID { get; set; }

        [Required]
        [StringLength(20)]
        public string MUD_PASSWORD { get; set; }

        [Required]
        
        public string MUD_USER_TYPE { get; set; }

        [StringLength(100)]
        public string MUD_USER_NAME { get; set; }

        [StringLength(1)]
        public string MUD_STATUS { get; set; }

        public DateTime MUD_CREATED_DATE { get; set; }

        [StringLength(7)]
        public string MUD_CREATED_BY { get; set; }

        public DateTime? MUD_UPDATED_DATE { get; set; }

        [StringLength(7)]
        public string MUD_UPDATED_BY { get; set; }

        
    }
}
