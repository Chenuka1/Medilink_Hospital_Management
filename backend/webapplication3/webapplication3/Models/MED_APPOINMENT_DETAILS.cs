using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapplication3.Models
{
    public class MED_APPOINMENT_DETAILS
    {

        [Key]

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MAD_APPOINMENT_ID { get; set; }

        public string MAD_FULL_NAME{ get; set; }

        public string MAD_CONTACT { get; set; }

        public int MAD_SEAT_NO { get; set; }

        public TimeSpan  MAD_START_TIME { get; set; }


        public TimeSpan  MAD_END_TIME { get; set; }


        public DateTime MAD_APPOINMENT_DATE { get; set; }



    }
}
