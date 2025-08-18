using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PressureMeasurementApp.API.Data.Dto;
using PressureMeasurementApp.API.Data.Entitites;
using PressureMeasurementApp.API.Interfaces;

namespace PressureMeasurementApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PressureMeasurementController : ControllerBase
    {
        private readonly IPressureMeasurementService _measurementService;
        private readonly IMapper _mapper;

        public PressureMeasurementController(IPressureMeasurementService measurementService, IMapper mapper)
        {
            _measurementService = measurementService;
            _mapper = mapper;
        }

        [HttpGet("withDates")]
        public async Task<ActionResult<IEnumerable<PressureMeasurementResponse>>> GetAllWithDates(
            DateTime from, DateTime till)
        {
            var userId = GetUserIdFromHeaders();
            var measurements = await _measurementService.GetMeasurementsAsync(from, till, userId);
            return Ok(_mapper.Map<IEnumerable<PressureMeasurementResponse>>(measurements));
        }

        [HttpGet("latest")]
        public async Task<ActionResult<IEnumerable<PressureMeasurementResponse>>> GetLatest()
        {
            var userId = GetUserIdFromHeaders();
            var measurements = await _measurementService.GetLatestMeasurementsAsync(userId);
            return Ok(_mapper.Map<IEnumerable<PressureMeasurementResponse>>(measurements));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PressureMeasurementResponse>> Get(int id)
        {
            try
            {
                var userId = GetUserIdFromHeaders();
                var measurement = await _measurementService.GetMeasurementAsync(id, userId);
                return Ok(_mapper.Map<PressureMeasurementResponse>(measurement));
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<PressureMeasurementResponse>> Add(
            [FromBody] CreateMeasurementRequest request)
        {
            try
            {
                var userId = GetUserIdFromHeaders();
                var measurement = await _measurementService.CreateMeasurementAsync(
                    request.Pressures, request.Lifestyle, userId);

                return Ok(_mapper.Map<PressureMeasurementResponse>(measurement));
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = "Error while parsing measurements values. Please try enter valid values!" });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id,
            [FromBody] PressureMeasurement request)
        {
            try
            {
                var userId = GetUserIdFromHeaders();
                await _measurementService.UpdateMeasurementAsync(id, request, userId);
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
                var userId = GetUserIdFromHeaders();
                await _measurementService.DeleteMeasurementAsync(id, userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        private int GetUserIdFromHeaders()
        {
            var userIdHeader = Request.Headers["X-User-Id"].FirstOrDefault();
            if (string.IsNullOrEmpty(userIdHeader) || !int.TryParse(userIdHeader, out int userId))
            {
                throw new UnauthorizedAccessException("User ID is required");
            }
            return userId;
        }
    }
}