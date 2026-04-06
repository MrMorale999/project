# Kubernetes Quick Start

## IMPORTANTE: Apri PowerShell, non cmd!

Premi `Win + X` e scegli **"Windows PowerShell"** oppure apri Windows Terminal.

---

Esegui questi comandi **uno per uno** in PowerShell:

---

## COMANDO 1 - Accedi al progetto
```
cd c:\Users\lnast\uni\Università\uni\Documenti\project
```
Premi Enter.

---

## COMANDO 2 - Configura Docker per Minikube
```
minikube docker-env | Invoke-Expression
```
Premi Enter. Aspetta che finisca.

---

## COMANDO 3 - Vai nella cartella backend
```
cd backend
```
Premi Enter.

---

## COMANDO 4 - Build immagine backend
```
docker build -t backend:latest .
```
Premi Enter. **Aspetta che finisca completamente** (vedrai "BUILD SUCCESS" alla fine). Può prendere 2-3 minuti.

---

## COMANDO 5 - Vai nella cartella frontend
```
cd ..\frontend
```
Premi Enter.

---

## COMANDO 6 - Build immagine frontend
```
docker build -t frontend:latest .
```
Premi Enter. **Aspetta che finisca completamente**. Può prendere 2-3 minuti.

---

## COMANDO 7 - Ritorna alla root del progetto
```
cd ..
```
Premi Enter.

---

## COMANDO 8 - Verifica che le immagini siano state create
```
docker images
```
Premi Enter. Dovresti vedere `backend:latest` e `frontend:latest` nella lista.

---

## COMANDO 9 - Deploy su Kubernetes
```
kubectl apply -f k8s/
```
Premi Enter. Aspetta che finisca.

---

## COMANDO 10 - Verifica lo stato dei pod
```
kubectl get pods
```
Premi Enter. 

Dovresti vedere:
```
NAME                       READY   STATUS    RESTARTS   AGE
backend-xxxxx              1/1     Running   0          2m
frontend-xxxxx             1/1     Running   0          2m
```

Se vedi **"Pending"** invece di **"Running"**, **aspetta 1-2 minuti** e ripeti il COMANDO 10.

---

## COMANDO 11 - Apri l'app nel browser
Una volta che vedi "Running", esegui:
```
minikube service frontend
```

Premi Enter. **Si aprirà il browser automaticamente** con l'app!

---

Se un comando fallisce, **fammi sapere quale e l'errore esatto**.
