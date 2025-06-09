using AutoMapper;
using PressureMeasurementApp.API.Data.Dto;
using PressureMeasurementApp.API.Data.Entitites;

namespace PressureMeasurementApp.API.Data.AutoMapperProfiles
{
    public class PressureMeasurementProfile : Profile
    {
        public PressureMeasurementProfile()
        {
            CreateMap<PressureMeasurement, PressureMeasurementResponse>().ReverseMap();
        }
    }
}
