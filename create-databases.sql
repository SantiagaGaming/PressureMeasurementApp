-- Создание базы данных для аутентификации
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'auth')
BEGIN
    CREATE DATABASE auth;
END

-- Создание базы данных для измерений давления
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'pressure_measurements')
BEGIN
    CREATE DATABASE pressure_measurements;
END

PRINT 'Базы данных созданы успешно!';
