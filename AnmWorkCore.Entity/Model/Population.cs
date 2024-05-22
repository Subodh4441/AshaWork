using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnmWorkCore.Entity.Model
{
    public class Population
    {
        [Key]
        public int PopulationId { get; set; }
        public string FullName { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string LandMark { get; set; }
        public int Pincode { get; set; }
        public string DateOfBirth { get; set; }
        public string AdharNumber { get; set; }
        public string Mobile { get; set; }
        public string TOFP { get; set; }
        public string Religion { get; set; }
        public string Education { get; set; }
        public string TypesOfRationCard { get; set; }
        public string MarriageStatus { get; set; }
    }
}
