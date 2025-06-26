using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PressureMeasurementApp.API.Data.Dto;
using PressureMeasurementApp.API.Interfaces;
using System.IO;

namespace PressureMeasurementApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController(IPressureMeasurementService measurementService, IMapper mapper, IParseToFile<PressureMeasurementToFile> converter) : ControllerBase
    {
        [HttpGet("xlsxLatest")]
        public async Task<IActionResult> GetXlsxLatest()
        {
            var measurements = await measurementService.GetLatestMeasurementsAsync();
            if (measurements == null || !measurements.Any())
                return NotFound("No measurements in this period.");

            try
            {
                var fileResult = await converter.PraseToXlsx(mapper.Map<IEnumerable<PressureMeasurementToFile>>(measurements));
                return File(
                    fileResult.FileContents,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    fileResult.FileDownloadName ?? $"measurements_{DateTime.Now:yyyyMMddHHmmss}.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = "Error while parsing measurements to xlsx", Details = ex.Message });
            }
        }

        [HttpGet("xlsxWithDates")]
        public async Task<IActionResult> GetXlsxWithDates(DateTime from, DateTime till)
        {
            if (from > till)
                return BadRequest("Start date cannot be later than end date");

            var measurements = await measurementService.GetMeasurementsAsync(from, till);
            if (measurements == null || !measurements.Any())
                return NotFound("No measurements in this period.");

            try
            {
                var fileResult = await converter.PraseToXlsx(mapper.Map<IEnumerable<PressureMeasurementToFile>>(measurements));

                return File(
                    fileResult.FileContents,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    fileResult.FileDownloadName ?? $"measurements_{from:yyyyMMdd}_to_{till:yyyyMMdd}.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = "Error while parsing measurements to xlsx", Details = ex.Message });
            }
        }
    }
}
