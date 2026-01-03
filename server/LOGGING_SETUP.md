# Configurare Logging cu Email și Slack

Acest proiect folosește **Winston** pentru logging, cu suport pentru trimitere automată de loguri pe **Email** și **Slack**.

## Pachete folosite

- **winston** - Logger principal
- **nodemailer** - Client SMTP pentru trimitere email
- **@slack/webhook** - Client pentru Slack webhooks

## Instalare

```bash
cd server
npm install
```

## Configurare

### 1. Variabile de mediu

Adaugă următoarele variabile în fișierul `.env`:

```env
# Logging Configuration
LOG_LEVEL=info  # debug, info, warn, error

# Email Configuration (pentru trimitere loguri pe email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@summaris.com
LOG_EMAIL_RECIPIENTS=admin@summaris.com,dev-team@summaris.com

# Slack Configuration (pentru trimitere loguri pe Slack)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/TEAM/ID/AND/WEBHOOK/PATH
```

### 2. Configurare Gmail (pentru email)

1. Activează "App Passwords" în contul Google:
   - Mergi la https://myaccount.google.com/apppasswords
   - Generează o parolă pentru aplicație
   - Folosește acea parolă în `SMTP_PASS`

### 3. Configurare Slack Webhook

1. Mergi la https://api.slack.com/apps
2. Creează o aplicație nouă sau selectează una existentă
3. Activează "Incoming Webhooks"
4. Adaugă un webhook nou pentru canalul dorit
5. Copiază URL-ul webhook-ului în `SLACK_WEBHOOK_URL`

## Utilizare

### Import logger-ul

```javascript
import logger, { logError, logInfo, logWarn, logDebug } from "./utils/logger.js";
```

### Exemple de utilizare

```javascript
// Log info
logInfo("User logged in", { userId: "123", email: "user@example.com" });

// Log warning
logWarn("Rate limit approaching", { userId: "123", requests: 95 });

// Log error (se trimite automat pe email și Slack dacă sunt configurate)
logError("Database connection failed", error, { 
  host: "localhost",
  port: 5432 
});

// Log debug
logDebug("Processing request", { path: "/api/users", method: "GET" });
```

### Nivele de logging

- **error** - Erori critice (se trimit pe email și Slack)
- **warn** - Avertismente (se trimit pe Slack)
- **info** - Informații generale
- **debug** - Informații de debugging

## Comportament

### Email
- Se trimite automat doar pentru logurile de nivel **error**
- Recipienții sunt configurați în `LOG_EMAIL_RECIPIENTS`
- Format: HTML cu detalii complete despre eroare

### Slack
- Se trimite automat pentru logurile de nivel **error** și **warn**
- Include mesajul, detalii suplimentare și timestamp
- Format: Mesaj formatat cu attachments colorate

### Fișiere
- Toate logurile se salvează în `logs/combined.log`
- Erorile se salvează separat în `logs/error.log`

## Testare

Pentru a testa configurarea:

```javascript
import { logError } from "./utils/logger.js";

// Testează trimiterea pe email și Slack
logError("Test error message", new Error("This is a test"), {
  test: true,
  timestamp: new Date().toISOString()
});
```

## Note importante

- Dacă variabilele de mediu pentru email sau Slack nu sunt setate, aceste transporturi nu vor fi activate (nu va apărea eroare)
- Logurile se scriu și în fișiere, indiferent de configurarea email/Slack
- Pentru producție, recomandăm `LOG_LEVEL=warn` sau `error` pentru a reduce volumul de loguri
