using PressureMeasurementApp.API.Data.Dto;
using PressureMeasurementApp.API.Data.Entitites;
using PressureMeasurementApp.API.Interfaces;

namespace PressureMeasurementApp.API.Services
{
    public class PressureConverter : IPressureConverter
    {
        public PressureMeasurement ConvertPressure(List<PressureDto> pressures, LifestyleDto lifestyle)
        {
            ValidateInput(pressures, lifestyle);

            var averageUpperPressure = CalculateAverage(pressures.Select(p => p.UpperPressure));
            var averageLowerPressure = CalculateAverage(pressures.Select(p => p.LowerPressure));
            var averageHeartbeat = CalculateAverage(pressures.Select(p => p.Heartbeat));

            var measurement = new PressureMeasurement
            {
                UpperPressure = averageUpperPressure,
                LowerPressure = averageLowerPressure,
                Heartbeat = averageHeartbeat,
                MeasureDate = DateTime.Now,
                Description = lifestyle.Description,
                Smoking = lifestyle.Smoking,
                Alcohol = lifestyle.Alcohol,
                Sport = lifestyle.Sport,
                Stretching = lifestyle.Stretching
            };
            measurement.PressureStateId = DeterminePressureStateId(measurement);
            return measurement;
        }

        private void ValidateInput(List<PressureDto> pressures, LifestyleDto lifestyle)
        {
            if (pressures == null)
                throw new ArgumentNullException(nameof(pressures), "Pressures cannot be null");

            if (lifestyle == null)
                throw new ArgumentNullException(nameof(lifestyle), "Lifestyle cannot be null");

            if (pressures.Count != 4)
                throw new ArgumentException("Pressures count must be equal to 4", nameof(pressures));
        }

        private int CalculateAverage(IEnumerable<int> values)
        {
            return (int)values.Average();
        }

        private int? DeterminePressureStateId(PressureMeasurement measurement)
        {
            if (measurement.UpperPressure < 90 )
                return 1; 

            if (measurement.UpperPressure < 135 )
                return 2; 

            if (measurement.UpperPressure < 150 )
                return 3; 

            if (measurement.UpperPressure >= 150)
                return 4; 

            return null; 
        }
    }
}


