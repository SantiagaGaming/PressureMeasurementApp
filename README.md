# Pressure Measurement App - Микросервисное приложение

Это тестовый проект микросервисной архитектуры для приложения измерения давления.

## Архитектура

Проект состоит из следующих компонентов:

1. **ApiGateway** - API Gateway на порту 8080
2. **AuthService.API** - Сервис аутентификации на порту 5206
3. **PressureMeasurementApp.API** - Сервис измерений давления на порту 5000
4. **client-app** - React/Next.js фронтенд приложение
5. **KafkaConsumerConsoleApp** - Консольное приложение для обработки Kafka сообщений

## Запуск проекта

### Предварительные требования

- .NET 8.0 SDK
- Node.js 18+ и npm
- SQL Server (локальный или Docker)
- Redis (для кэширования)

### 1. Настройка базы данных

Создайте базу данных `auth` для AuthService и `pressure_measurements` для PressureMeasurementApp.API.

### 2. Запуск микросервисов

#### AuthService.API
```bash
cd AuthService.API
dotnet run
```
Сервис будет доступен на http://localhost:5206

#### PressureMeasurementApp.API
```bash
cd PressureMeasurementApp.API
dotnet run
```
Сервис будет доступен на http://localhost:5000

#### ApiGateway
```bash
cd ApiGateway
dotnet run
```
API Gateway будет доступен на http://localhost:8080

### 3. Запуск фронтенда

```bash
cd client-app
npm install
npm run dev
```
Фронтенд будет доступен на http://localhost:3000

## Конфигурация

### API Gateway
- Порт: 8080
- Маршрутизация:
  - `/auth/*` → AuthService.API (localhost:5206)
  - `/measurements/*` → PressureMeasurementApp.API (localhost:5000)

### JWT Настройки
Все сервисы используют одинаковые JWT настройки:
- Key: "your-super-secret-key-with-at-least-32-characters"
- Issuer: "PressureMeasurementApp"
- Audience: "PressureMeasurementApp"

## Проблемы и решения

### 1. Проблема с Loading...
Исправлено: Убрана двойная проверка токена в ProtectedRoute и главной странице.

### 2. Перенаправление на страницу авторизации
Исправлено: Добавлена проверка токена в AppLayout с исключением для страницы `/auth`.

### 3. Конфигурация для локальной разработки
Создан `appsettings.Development.json` в ApiGateway с правильными портами для локальной разработки.

## API Endpoints

### AuthService.API
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/validate` - Валидация токена
- `POST /api/auth/logout` - Выход

### PressureMeasurementApp.API
- `GET /api/PressureMeasurement/latest` - Последние измерения
- `GET /api/PressureMeasurement/withDates` - Измерения по датам
- `GET /api/PressureMeasurement/{id}` - Измерение по ID
- `POST /api/PressureMeasurement` - Создание измерения
- `PUT /api/PressureMeasurement/{id}` - Обновление измерения
- `DELETE /api/PressureMeasurement/{id}` - Удаление измерения

## Тестирование

1. Откройте http://localhost:3000
2. Зарегистрируйтесь или войдите в систему
3. Добавьте измерения давления
4. Просматривайте и редактируйте измерения

## Docker (опционально)

Для запуска в Docker используйте:
```bash
docker-compose up
```

Это запустит все сервисы в контейнерах с правильной конфигурацией.
