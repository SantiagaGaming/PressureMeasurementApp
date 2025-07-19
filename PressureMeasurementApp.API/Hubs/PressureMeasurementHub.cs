using Microsoft.AspNetCore.SignalR;

namespace PressureMeasurementApp.API.Hubs
{
    public class PressureMeasurementHub : Hub
    {
        public async Task SubscribeToUpdates()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "MeasurementsGroup");
        }

        public async Task UnsubscribeFromUpdates()
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "MeasurementsGroup");
        }
    }
}
