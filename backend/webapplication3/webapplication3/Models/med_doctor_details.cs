using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapplication3.Models
{
    public class med_doctor_details
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int mdd_doctor_id { get; set; }

        public string mdd_doctor_name { get; set; }

        public string mdd_email { get; set; }
        public string mdd_password { get; set; }

    }
}
