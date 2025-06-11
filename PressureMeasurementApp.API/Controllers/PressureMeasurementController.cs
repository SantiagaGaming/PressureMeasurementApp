using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PressureMeasurementApp.API.Data.Dto;
using PressureMeasurementApp.API.Interfaces;

namespace PressureMeasurementApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PressureMeasurementController(IPressureMeasurementService measurementService, IMapper mapper) : ControllerBase
    {

        [HttpGet("withDates")]
        public async Task<ActionResult<IEnumerable<PressureMeasurementResponse>>> GetAllWithDates(
            DateTime from, DateTime till)
        {
            var measurements = await measurementService.GetMeasurementsAsync(from, till);
            return Ok(mapper.Map<IEnumerable<PressureMeasurementResponse>>(measurements));
        }

        [HttpGet("latest")]
        public async Task<ActionResult<IEnumerable<PressureMeasurementResponse>>> GetLatest()
        {
            var measurements = await measurementService.GetLatestMeasurementsAsync();
            return Ok(mapper.Map<IEnumerable<PressureMeasurementResponse>>(measurements));
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<PressureMeasurementResponse>> Get(
       int id)
        {
            try
            {
                var measurement = await measurementService.GetMeasurementAsync(id);
                return Ok(mapper.Map<PressureMeasurementResponse>(measurement));
            }
            catch (Exception ex) {
                return NotFound(ex.Message);
            }
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
            catch (Exception ex)
            {
                return BadRequest(new { Error = "Error while parsing measurments values. Please try enter valid values!" });
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
            catch (Exception ex)
            {
                return NotFound(ex.Message);
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
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}