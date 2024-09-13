using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapplication3.Models
{
    public class timeslotModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int slot_id { get; set; }

        public DateTime slot_date { get; set; }

        public TimeSpan start_time { get; set; }

        public TimeSpan end_time { get; set; }

        public TimeSpan timeslot { get; set; }

        public int maximum_patients { get; set; }

        public int seat_number { get; set; }
    }
}
