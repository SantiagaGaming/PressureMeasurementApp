using System.ComponentModel.DataAnnotations.Schema;

namespace PressureMeasurementApp.API.Data.Entitites
{
    public class PressureMeasurement
    {
        public int Id { get; set; }
        public int UpperPressure { get; set; }
        public int LowerPressure { get; set; }
        public int Heartbeat { get; set; }
        public DateTime MeasureDate { get; set; }
        public string? Description { get; set; }
        public bool Smoking { get; set; }
        public bool Alcohol { get; set; }
        public bool Sport { get; set; }
        public bool Stretching { get; set; }
        [ForeignKey(nameof(PressureStateId))]
        public PressureState? PressureState { get; set; }
        public int? PressureStateId { get; set; }
    }
}
