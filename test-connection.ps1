Write-Host "Проверка подключения к базам данных..."

# Проверка подключения к SQL Server
try {
    $connectionString = "Server=localhost;Database=master;Trusted_Connection=true;TrustServerCertificate=true;"
    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $connection.Open()
    Write-Host "✅ Подключение к SQL Server успешно"
    $connection.Close()
} catch {
    Write-Host "❌ Ошибка подключения к SQL Server: $($_.Exception.Message)"
}

# Проверка существования базы данных auth
try {
    $connectionString = "Server=localhost;Database=auth;Trusted_Connection=true;TrustServerCertificate=true;"
    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $connection.Open()
    Write-Host "✅ База данных 'auth' существует"
    $connection.Close()
} catch {
    Write-Host "❌ База данных 'auth' не существует или недоступна"
}

# Проверка существования базы данных pressure_measurements
try {
    $connectionString = "Server=localhost;Database=pressure_measurements;Trusted_Connection=true;TrustServerCertificate=true;"
    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $connection.Open()
    Write-Host "✅ База данных 'pressure_measurements' существует"
    $connection.Close()
} catch {
    Write-Host "❌ База данных 'pressure_measurements' не существует или недоступна"
}
