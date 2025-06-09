using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PressureMeasurementApp.API.Data.Dto;
using PressureMeasurementApp.API.Exceptions;
using PressureMeasurementApp.API.Interfaces;

namespace PressureMeasurementApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PressureMeasurementController(IPressureMeasurementService measurementService, IMapper mapper) : ControllerBase
    {

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PressureMeasurementResponse>>> GetAll(
            DateTime from, DateTime till)
        {
            var measurements = await measurementService.GetMeasurementsAsync(from, till);
            return Ok(mapper.Map<IEnumerable<PressureMeasurementResponse>>(measurements));
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<PressureMeasurementResponse>> Get(
       int id)
        {
          var measurement = await measurementService.GetMeasurementAsync(id);
            return Ok(mapper.Map<PressureMeasurementResponse>(measurement));
        }

        [HttpPost]
        public async Task<ActionResult<PressureMeasurementResponse>> Add(
            [FromBody] CreateMeasurementRequest request)
        {
            try
            {
                var measurement = await measurementService.CreateMeasurementAsync(
                    request.Pressures, request.Lifestyle);

                return 
                    mapper.Map<PressureMeasurementResponse>(measurement);
            }
            catch (MeasurementValidationException ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id,
            [FromBody] UpdateMeasurementRequest request)
        {
            try
            {
                await measurementService.UpdateMeasurementAsync(id, request);
                return NoContent();
            }
            catch (MeasurementNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await measurementService.DeleteMeasurementAsync(id);
                return NoContent();
            }
            catch (MeasurementNotFoundException)
            {
                return NotFound();
            }
        }
    }
}