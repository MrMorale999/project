# Microservizi Java + Angular

Questo workspace contiene due microservizi:

- `backend` - microservizio Java Spring Boot
- `frontend` - applicazione Angular per il frontend

## Come avviare

### Sviluppo locale

#### Backend

1. Apri la cartella `backend`
2. Compila: `mvn clean package -DskipTests`
3. Avvia: `java -jar target\backend-0.0.1-SNAPSHOT.jar`

Oppure usa lo script: `start-backend.bat`

#### Frontend

1. Apri la cartella `frontend`
2. Esegui `npm install` (solo la prima volta)
3. Avvia: `npx ng serve --host 0.0.0.0 --port 4200`

Oppure usa lo script: `start-frontend.bat`

Il frontend richiama il backend su `/api/hello` tramite proxy.

### Docker (se disponibile)

Per avviare entrambi i microservizi con Docker:

1. Assicurati di avere Docker e Docker Compose installati
2. Dalla root del progetto, esegui:
   ```bash
   docker-compose up --build
   ```
3. Apri il browser su `http://localhost` per il frontend
4. Il backend sarà disponibile su `http://localhost:8080`

Per fermare:
```bash
docker-compose down
```

### Kubernetes (Deployment avanzato)

Per deployare su Kubernetes (minikube, Docker Desktop, Azure AKS, ecc.):

1. Vedi [K8S_GUIDE.md](K8S_GUIDE.md) per istruzioni dettagliate
2. Oppure usa lo script rapido:
   ```bash
   deploy-k8s.bat
   ```

I manifest Kubernetes sono in cartella `k8s/`:
- `backend.yaml` - Deployment + Service per il backend
- `frontend.yaml` - Deployment + Service per il frontend
- `ingress.yaml` - Ingress per routing avanzato (opzionale)

### API

- Backend: `http://localhost:8080`
  - GET `/api/hello` - messaggio di benvenuto
  - POST `/api/notify` - invia notifica WebSocket
- Frontend: `http://localhost:4200`
  - Interfaccia utente con WebSocket per notifiche
