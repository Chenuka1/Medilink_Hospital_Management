using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapplication3.Models
{
    public class MED_TIMESLOT
    {

        [Key]

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int MT_SLOT_ID { get; set; }

        public DateTime MT_SLOT_DATE { get; set; }

        public TimeSpan MT_START_TIME { get; set; }

        public TimeSpan MT_END_TIME { get; set; }

        public int  MT_SEAT_NUMBER { get; set; }

        public int? MT_MAXIMUM_PATIENTS {  get; set; }

    }
}
