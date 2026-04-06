# Avvio rapido microservizi

## Backend
1. Apri terminale in `backend/`
2. `mvn clean package -DskipTests`
3. `java -jar target\backend-0.0.1-SNAPSHOT.jar`

## Frontend
1. Apri terminale in `frontend/`
2. `npm install` (primo avvio)
3. `npx ng serve --host 0.0.0.0 --port 4200`

## Accesso
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080/api/hello
- Backend WebSocket: ws://localhost:8080/ws/echo

## Test notifica
curl -X POST http://localhost:8080/api/notify \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","body":"Funziona!"}'