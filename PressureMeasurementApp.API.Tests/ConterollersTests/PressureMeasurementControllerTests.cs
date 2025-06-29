using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using PressureMeasurementApp.API.Controllers;
using PressureMeasurementApp.API.Data.Dto;
using PressureMeasurementApp.API.Data.Entitites;
using PressureMeasurementApp.API.Interfaces;
using Xunit;
namespace PressureMeasurementApp.API.Tests.ConterollersTests
{
    public class PressureMeasurementControllerTests
    {
        private readonly Mock<IPressureMeasurementService> _mockService;
        private readonly Mock<IMapper> _mockMapper;
        private readonly PressureMeasurementController _controller;

        public PressureMeasurementControllerTests()
        {
            _mockService = new Mock<IPressureMeasurementService>();
            _mockMapper = new Mock<IMapper>();
            _controller = new PressureMeasurementController(_mockService.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task GetAllWithDates_ReturnsOkResultWithMeasurements()
        {
            // Arrange
            var fromDate = DateTime.Now.AddDays(-7);
            var tillDate = DateTime.Now;
            var measurements = new List<PressureMeasurement> { new PressureMeasurement() };
            var expectedResponse = new List<PressureMeasurementResponse> { new PressureMeasurementResponse() };

            _mockService.Setup(s => s.GetMeasurementsAsync(fromDate, tillDate))
                .ReturnsAsync(measurements);
            _mockMapper.Setup(m => m.Map<IEnumerable<PressureMeasurementResponse>>(measurements))
                .Returns(expectedResponse);

            // Act
            var result = await _controller.GetAllWithDates(fromDate, tillDate);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<PressureMeasurementResponse>>(okResult.Value);
            Assert.Single(returnValue);
        }

        [Fact]
        public async Task GetLatest_ReturnsOkResultWithLatestMeasurements()
        {
            // Arrange
            var measurements = new List<PressureMeasurement> { new PressureMeasurement() };
            var expectedResponse = new List<PressureMeasurementResponse> { new PressureMeasurementResponse() };

            _mockService.Setup(s => s.GetLatestMeasurementsAsync())
                .ReturnsAsync(measurements);
            _mockMapper.Setup(m => m.Map<IEnumerable<PressureMeasurementResponse>>(measurements))
                .Returns(expectedResponse);

            // Act
            var result = await _controller.GetLatest();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<PressureMeasurementResponse>>(okResult.Value);
            Assert.Single(returnValue);
        }

        [Fact]
        public async Task Get_WithValidId_ReturnsOkResultWithMeasurement()
        {
            // Arrange
            var id = 2;
            var measurement = new PressureMeasurement { Id = id };
            var expectedResponse = new PressureMeasurementResponse { Id = id };

            _mockService.Setup(s => s.GetMeasurementAsync(id))
                .ReturnsAsync(measurement);
            _mockMapper.Setup(m => m.Map<PressureMeasurementResponse>(measurement))
                .Returns(expectedResponse);

            // Act
            var result = await _controller.Get(id);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<PressureMeasurementResponse>(okResult.Value);
            Assert.Equal(id, returnValue.Id);
        }

        [Fact]
        public async Task Get_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var id = 999;
            var errorMessage = "Measurement not found";

            _mockService.Setup(s => s.GetMeasurementAsync(id))
                .ThrowsAsync(new Exception(errorMessage));

            // Act
            var result = await _controller.Get(id);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Equal(errorMessage, notFoundResult.Value);
        }

        [Fact]
        public async Task Add_WithValidRequest_ReturnsMeasurementResponse()
        {
            // Arrange
            var request = new CreateMeasurementRequest
            {
                Pressures = new List<PressureDto>
        {
            new PressureDto { UpperPressure = 120, LowerPressure = 80, Heartbeat = 70 },
            new PressureDto { UpperPressure = 120, LowerPressure = 80, Heartbeat = 70 },
            new PressureDto { UpperPressure = 120, LowerPressure = 80, Heartbeat = 70 },
            new PressureDto { UpperPressure = 120, LowerPressure = 80, Heartbeat = 70 }
        },
                Lifestyle = new LifestyleDto()
                {
                    Description = "Test measurement",
                    Alcohol = false,
                    Smoking = false,
                    Sport = true,
                    Stretching = true
                }
            };

            var pressureState = new PressureState { Id = 2, Name = "Normal" };
            var createdMeasurement = new PressureMeasurement
            {
                Id = 1,
                UpperPressure = 120,
                LowerPressure = 80,
                Heartbeat = 70,
                MeasureDate = DateTime.UtcNow,
                Description = "Test measurement",
                Smoking = false,
                Alcohol = false,
                Sport = true,
                Stretching = true,
                PressureStateId = 2,
                PressureState = pressureState
            };

            var expectedResponse = new PressureMeasurementResponse
            {
                Id = 1,
                UpperPressure = 120,
                LowerPressure = 80,
                Heartbeat = 70,
                MeasureDate = createdMeasurement.MeasureDate,
                Description = "Test measurement",
                Smoking = false,
                Alcohol = false,
                Sport = true,
                Stretching = true,
                PressureState = pressureState
            };

            _mockService.Setup(s => s.CreateMeasurementAsync(
                    It.IsAny<List<PressureDto>>(),
                    It.IsAny<LifestyleDto>()))
                .ReturnsAsync(createdMeasurement);

            _mockMapper.Setup(m => m.Map<PressureMeasurementResponse>(createdMeasurement))
                .Returns(expectedResponse);

            // Act
            var actionResult = await _controller.Add(request);

            // Assert
            var result = Assert.IsType<ActionResult<PressureMeasurementResponse>>(actionResult);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<PressureMeasurementResponse>(okResult.Value);

            Assert.Equal(expectedResponse.Id, response.Id);
            Assert.Equal(expectedResponse.UpperPressure, response.UpperPressure);
            Assert.Equal(expectedResponse.LowerPressure, response.LowerPressure);
            Assert.Equal(expectedResponse.Heartbeat, response.Heartbeat);
            Assert.Equal(expectedResponse.MeasureDate, response.MeasureDate, TimeSpan.FromSeconds(1));
            Assert.Equal(expectedResponse.Description, response.Description);
            Assert.Equal(expectedResponse.Smoking, response.Smoking);
            Assert.Equal(expectedResponse.Alcohol, response.Alcohol);
            Assert.Equal(expectedResponse.Sport, response.Sport);
            Assert.Equal(expectedResponse.Stretching, response.Stretching);
            Assert.Equal(expectedResponse.PressureState.Id, response.PressureState.Id);
            Assert.Equal(expectedResponse.PressureState.Name, response.PressureState.Name);
        }
        [Fact]
        public async Task Add_WithInvalidRequest_ReturnsBadRequest()
        {
            // Arrange
            var request = new CreateMeasurementRequest
            {
                Pressures = new List<PressureDto>
        {
            new PressureDto
            {
                UpperPressure = -1,
                LowerPressure = 80,
                Heartbeat = 70
            },
            new PressureDto
            {
                UpperPressure = 110,
                LowerPressure = 75,
                Heartbeat = 72
            },
            new PressureDto
            {
                UpperPressure = 115,
                LowerPressure = 78,
                Heartbeat = 68
            },
            new PressureDto
            {
                UpperPressure = 125,
                LowerPressure = 85,
                Heartbeat = 65
            }
        },
                Lifestyle = new LifestyleDto()
            };

            _mockService.Setup(s => s.CreateMeasurementAsync(request.Pressures, request.Lifestyle))
                .ThrowsAsync(new Exception());

            // Act
            var result = await _controller.Add(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequestResult.Value);
        }

        [Fact]
        public async Task Update_WithValidId_ReturnsNoContent()
        {
            // Arrange
            var id = 1;
            var request = new PressureMeasurement { Id = id };

            _mockService.Setup(s => s.UpdateMeasurementAsync(id, request))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Update(id, request);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Update_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var id = 999;
            var request = new PressureMeasurement { Id = id };
            var errorMessage = "Measurement not found";

            _mockService.Setup(s => s.UpdateMeasurementAsync(id, request))
                .ThrowsAsync(new Exception(errorMessage));

            // Act
            var result = await _controller.Update(id, request);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal(errorMessage, notFoundResult.Value);
        }

        [Fact]
        public async Task Delete_WithValidId_ReturnsNoContent()
        {
            // Arrange
            var id = 2;

            _mockService.Setup(s => s.DeleteMeasurementAsync(id))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Delete(id);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Delete_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var id = 999;
            var errorMessage = "Measurement not found";

            _mockService.Setup(s => s.DeleteMeasurementAsync(id))
                .ThrowsAsync(new Exception(errorMessage));

            // Act
            var result = await _controller.Delete(id);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal(errorMessage, notFoundResult.Value);
        }
    }
}