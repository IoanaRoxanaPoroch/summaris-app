# Ghid pas cu pas pentru configurarea Email și Slack

## Pasul 1: Creează fișierul .env

Copiază template-ul:

```bash
cd server
cp .env.example .env
```

## Pasul 2: Configurează Email (Gmail)

### 2.1. Activează 2-Step Verification

1. Mergi la https://myaccount.google.com/security
2. Activează "2-Step Verification" dacă nu este deja activat

### 2.2. Generează App Password

1. Mergi la https://myaccount.google.com/apppasswords
2. Selectează "Mail" și "Other (Custom name)"
3. Introdu un nume (ex: "Summaris API Logging")
4. Click "Generate"
5. Copiază parola generată (16 caractere, fără spații)

### 2.3. Completează în .env

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # Parola generată (fără spații)
SMTP_FROM=noreply@summaris.com
LOG_EMAIL_RECIPIENTS=your-email@gmail.com,team@example.com
```

**Notă:** Pentru `LOG_EMAIL_RECIPIENTS`, poți adăuga mai multe email-uri separate prin virgulă.

## Pasul 3: Configurează Slack

### 3.1. Creează Slack App

1. Mergi la https://api.slack.com/apps
2. Click "Create New App" → "From scratch"
3. Introdu:
   - **App Name:** Summaris API Logging
   - **Pick a workspace:** Selectează workspace-ul tău
4. Click "Create App"

### 3.2. Activează Incoming Webhooks

1. În meniul din stânga, click "Incoming Webhooks"
2. Activează "Activate Incoming Webhooks" (toggle ON)
3. Scroll în jos și click "Add New Webhook to Workspace"
4. Selectează canalul unde vrei să primești notificările (ex: #alerts, #errors)
5. Click "Allow"
6. **Copiază Webhook URL** (format: `https://hooks.slack.com/services/YOUR/TEAM/ID/AND/WEBHOOK/PATH`)

### 3.3. Completează în .env

```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/TEAM/ID/AND/WEBHOOK/PATH
```

## Pasul 4: Testează configurarea

### 4.1. Testează Email

Creează un fișier de test `test-logging.js`:

```javascript
import "dotenv/config";
import { logError } from "./utils/logger.js";

logError("Test email notification", new Error("This is a test"), {
  test: true,
  timestamp: new Date().toISOString(),
});

console.log("Check your email inbox!");
```

Rulează:

```bash
node test-logging.js
```

### 4.2. Testează Slack

Folosește același fișier de test - dacă ai configurat Slack, vei primi și notificare pe Slack.

### 4.3. Testează din aplicație

Pornește serverul și generează o eroare:

```bash
npm start
```

Apoi testează un endpoint care generează eroare sau folosește:

```javascript
import { logError } from "./utils/logger.js";
logError("Test error", new Error("Test"));
```

## Pasul 5: Verifică logurile

### Fișiere

- `logs/combined.log` - toate logurile
- `logs/error.log` - doar erorile

### Email

- Verifică inbox-ul pentru email-uri cu subiect "Summaris API - Error Alert"

### Slack

- Verifică canalul Slack configurat pentru mesaje de eroare și warning

## Troubleshooting

### Email nu funcționează

- Verifică că ai folosit App Password, nu parola normală
- Verifică că 2-Step Verification este activat
- Verifică că `SMTP_USER` este email-ul corect
- Verifică că `SMTP_PASS` nu conține spații

### Slack nu funcționează

- Verifică că Webhook URL este corect
- Verifică că aplicația Slack are permisiuni pentru webhook-ul respectiv
- Verifică că canalul selectat există și aplicația are acces

### Logurile nu se scriu

- Verifică că directorul `logs/` există și are permisiuni de scriere
- Verifică că `LOG_LEVEL` este setat corect

## Note importante

- **Nu comita fișierul `.env` în git** - este deja în `.gitignore`
- **Email-urile se trimit doar pentru erori** (nivel `error`)
- **Slack primește erori și warning-uri** (nivel `error` și `warn`)
- **Toate logurile se scriu în fișiere**, indiferent de configurarea Email/Slack




