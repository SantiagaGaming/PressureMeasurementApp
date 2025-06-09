using PressureMeasurementApp.API.Data.Dto;
using PressureMeasurementApp.API.Data.Entitites;

namespace PressureMeasurementApp.API.Interfaces
{
    public interface IPressureConverter
    {
        PressureMeasurement ConvertPressure(List<PressureDto> pressures,LifestyleDto lifestyle);
    }
}
