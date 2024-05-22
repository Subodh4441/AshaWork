using System.ComponentModel.DataAnnotations;

namespace AnmWorkCore.Models
{
    public class PeopleDetails
    {
        [Key]
        public int PopulationId { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
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
