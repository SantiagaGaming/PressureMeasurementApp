namespace PressureMeasurementApp.API.Interfaces
{
    public interface IRepository<T> : IDisposable where T : class
    {
        Task<IEnumerable<T>> GetAllWithDatesAsync(DateTime from, DateTime till);
        Task<T> GetEntityAsync(int id);
        Task CreateAsync(T item);
        Task<bool> UpdateAsync(int id, T item);
        Task<bool> DeleteAsync(int id);
        Task SaveAsync();
    }
}