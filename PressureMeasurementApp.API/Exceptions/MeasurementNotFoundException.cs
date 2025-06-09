namespace PressureMeasurementApp.API.Exceptions
{
    public class MeasurementNotFoundException : Exception
    {
        public MeasurementNotFoundException(int id)
            : base($"Measurement with id {id} not found") { }
    }
}
