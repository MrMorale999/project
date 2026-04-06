# GitHub Deploy Guide

## Step 1: Installa Git (se non lo hai)

### Download ufficiale
1. Vai a https://git-scm.com/download/win
2. Scarica l'installer per Windows
3. Doppio click e installa (accetta tutti i default)
4. **Riavvia PowerShell**
5. Verifica: `git --version`

---

## Step 2: Configura Git

Esegui questi comandi UNA VOLTA in PowerShell:

```powershell
git config --global user.name "Il Tuo Nome"
git config --global user.email "tua@email.com"
```

---

## Step 3: Crea repository su GitHub

1. Vai a https://github.com/new
2. Scegli un nome (es. `notification-app`)
3. Seleziona "Public" (per Render possa vederlo)
4. **NON** spuntare "Add a README" (ne hai già uno)
5. Clicca "Create repository"
6. **Copia l'URL** che vedi (tipo: `https://github.com/tuousername/notification-app.git`)

---

## Step 4: Pusha il codice su GitHub

Esegui questi comandi in PowerShell dalla cartella del progetto:

```powershell
# 1. Inizializza il repository locale
git init

# 2. Aggiungi tutto
git add .

# 3. Primeiro commit
git commit -m "Initial commit: WebSocket notification system with Docker"

# 4. Aggiungi il remote di GitHub (sostituisci l'URL!)
git remote add origin https://github.com/TUOUSERNAME/REPO.git

# 5. Rinomina il branch a main
git branch -M main

# 6. Pusha su GitHub
git push -u origin main
```

**ATTENZIONE:** Sostituisci `https://github.com/TUOUSERNAME/REPO.git` con l'URL che hai copiato al passo 3!

---

## Step 5: Se ti chiede la password

GitHub non accetta più la password per il git push. Usa un **Personal Access Token**:

1. Vai a https://github.com/settings/tokens
2. Clicca "Generate new token" (classic)
3. Seleziona `repo` (tutta la sezione)
4. Clicca "Generate token"
5. **Copia il token** (lo vedrai solo una volta!)
6. Quando Git ti chiede la password, incolla il token

---

## Step 6: Verifica su GitHub

1. Vai al tuo repository GitHub
2. Dovresti vedere tutti i file pushati
3. Se sì, sei pronto per Render! ✅

---

## Problemi comuni?

**"git is not recognized"**
→ Git non è installato. Scaricalo da https://git-scm.com/download/win

**"fatal: not a git repository"**
→ Non sei nella cartella del progetto. Assicurati di essere in: `C:\Users\lnast\uni\Università\uni\Documenti\project`

**"fatal: 'origin' already exists"**
→ Se non è il primo push, cancella il remote: `git remote remove origin`

---

## Prossimo passo
Una volta pushato su GitHub, vai su **Render.com** e crea il Web Service! 🚀
