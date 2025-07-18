
namespace PressureMeasurementApp.API.Data.Dto
{
    public class PressureMeasurementToFile
    {
        public string PressureAllStats { get; set; }
        public string MeasureDate { get; set; }
        public string? Description { get; set; }
        public string Smoking { get; set; }
        public string Alcohol { get; set; }
        public string Sport { get; set; }
        public string Stretching { get; set; }
        public string? PressureStateName { get; set; }
    }
}
