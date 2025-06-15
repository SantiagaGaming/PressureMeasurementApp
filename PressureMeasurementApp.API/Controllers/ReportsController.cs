using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PressureMeasurementApp.API.Data.Dto;
using PressureMeasurementApp.API.Interfaces;

namespace PressureMeasurementApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController(IPressureMeasurementService measurementService, IMapper mapper, IParseToFile<PressureMeasurementToFile> converter) : ControllerBase
    {
        [HttpGet("xlsx")]
        public async Task<ActionResult<FileContentResult>> GetXlsx(DateTime from, DateTime till)
        {
            var measurements = await measurementService.GetMeasurementsAsync(from, till);
            if (measurements == null)
                return NotFound("No measurements in these period.");
            try
            {
                var fileResult = await converter.PraseToXlsx(mapper.Map<IEnumerable<PressureMeasurementToFile>>(measurements));
                return Ok(fileResult);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = "Error while parsing measurments to xlsx" });
            }
        }
    }
}
