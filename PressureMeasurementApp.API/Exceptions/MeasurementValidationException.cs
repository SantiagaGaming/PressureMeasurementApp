namespace PressureMeasurementApp.API.Exceptions
{
    public class MeasurementValidationException : Exception
    {
        public MeasurementValidationException(string message) : base(message) { }
    }
}
