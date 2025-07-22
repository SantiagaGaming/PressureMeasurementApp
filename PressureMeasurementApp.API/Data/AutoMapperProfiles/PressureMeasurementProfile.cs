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

            CreateMap<PressureMeasurement, PressureMeasurementToFile>()
                .ForMember(dest => dest.PressureStateName,
                          opt => opt.MapFrom(src => src.PressureState != null ? src.PressureState.Name : null))
                .ForMember(dest => dest.PressureAllStats,
                          opt => opt.MapFrom(src =>
                              $"{src.UpperPressure}/{src.LowerPressure}/{src.Heartbeat}"))
                .ForMember(dest => dest.Smoking,
                          opt => opt.MapFrom(src => src.Smoking ? "Yes" : "No"))
                .ForMember(dest => dest.Alcohol,
                          opt => opt.MapFrom(src => src.Alcohol ? "Yes" : "No"))
                .ForMember(dest => dest.Sport,
                          opt => opt.MapFrom(src => src.Sport ? "Yes" : "No"))
                .ForMember(dest => dest.Stretching,
                          opt => opt.MapFrom(src => src.Stretching ? "Yes" : "No"))
                .ForMember(dest => dest.MeasureDate,
                          opt => opt.MapFrom(src => src.MeasureDate.ToString("dd.MM.yyyy HH:mm")));
        }
    }
}
