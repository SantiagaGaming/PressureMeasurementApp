namespace AuthService.API.Data.Entities
{
    public class InvalidToken
    {
        public int Id { get; set; }
        public string Token { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
