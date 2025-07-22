using System.ComponentModel.DataAnnotations;

namespace PressureMeasurementApp.API.Data.Dto
{
    public class CreateMeasurementRequest
    {
        [Required]
        [MinLength(1)]
        [MaxLength(4)]
        public List<PressureDto> Pressures { get; set; }

        [Required]
        public LifestyleDto Lifestyle { get; set; }
    }

}
