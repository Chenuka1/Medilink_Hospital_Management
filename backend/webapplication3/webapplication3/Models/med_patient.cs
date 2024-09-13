using System.ComponentModel.DataAnnotations;

namespace webapplication3.Models
{
    public class med_patient
    {


        [Key]

        public string mp_patient_id { get; set; }

        
        public string mp_full_name { get; set; }

       
        public string mp_email { get; set; }


     
        public string mp_contact { get; set; }

        

        public string mp_password { get; set; }



        public string mp_nic_no { get;set; }

        public string mp_patient_type { get; set; }


        public string mp_address { get; set; }




    }
}
