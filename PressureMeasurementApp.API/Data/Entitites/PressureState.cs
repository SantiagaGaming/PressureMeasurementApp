using System.ComponentModel.DataAnnotations.Schema;

namespace PressureMeasurementApp.API.Data.Entitites
{
    public class PressureState
    {
        public int Id { get; set; }
        public string? Name { get; set; }
    }
}
