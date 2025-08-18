# Быстрая настройка проекта

## Шаг 1: Настройка базы данных

Создайте базы данных:
- `auth` - для AuthService.API
- `pressure_measurements` - для PressureMeasurementApp.API

## Шаг 2: Запуск микросервисов

### AuthService.API (порт 5206)
```bash
cd AuthService.API
dotnet run
```

### PressureMeasurementApp.API (порт 5000)
```bash
cd PressureMeasurementApp.API
dotnet run
```

### ApiGateway (порт 8080)
```bash
cd ApiGateway
dotnet run
```

## Шаг 3: Запуск фронтенда

```bash
cd client-app
npm install
npm run dev
```

## Шаг 4: Тестирование

1. Откройте http://localhost:3000
2. Зарегистрируйтесь
3. Добавьте измерения давления

## Порты сервисов

- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- AuthService: http://localhost:5206
- PressureMeasurementApp: http://localhost:5000

## Возможные проблемы

1. **Ошибка подключения к базе данных**: Проверьте строки подключения в `appsettings.json`
2. **CORS ошибки**: Все сервисы настроены для работы с localhost
3. **JWT ошибки**: Все сервисы используют одинаковые JWT настройки
