using Microsoft.AspNetCore.Mvc;
using PressureMeasurementApp.API.Data.Dto;

namespace PressureMeasurementApp.API.Interfaces
{
    public interface IParseToFile<T>
    {
        Task<FileContentResult> PraseToXlsx(IEnumerable<T> entities);
    }
}
