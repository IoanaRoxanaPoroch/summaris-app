import { IncomingWebhook } from "@slack/webhook";
import nodemailer from "nodemailer";
import winston from "winston";
import Transport from "winston-transport";

// Custom transport pentru Slack
class SlackTransport extends Transport {
  constructor(options) {
    super(options);
    this.webhookUrl = options.webhookUrl;
    this.webhook = options.webhookUrl
      ? new IncomingWebhook(options.webhookUrl)
      : null;
    this.level = options.level || "error";
  }

  log(info, callback) {
    if (!this.webhook) {
      return callback();
    }

    const { level, message, ...meta } = info;

    // Trimite doar erorile și warning-urile pe Slack
    if (level === "error" || level === "warn") {
      const slackMessage = {
        text: `*${level.toUpperCase()}* - ${message}`,
        attachments: [
          {
            color: level === "error" ? "danger" : "warning",
            fields: [
              {
                title: "Message",
                value: message,
                short: false,
              },
              ...(Object.keys(meta).length > 0
                ? [
                    {
                      title: "Details",
                      value: "```" + JSON.stringify(meta, null, 2) + "```",
                      short: false,
                    },
                  ]
                : []),
            ],
            footer: "Summaris API",
            ts: Math.floor(Date.now() / 1000),
          },
        ],
      };

      this.webhook.send(slackMessage).catch((err) => {
        console.error("Failed to send log to Slack:", err);
      });
    }

    callback();
  }
}

// Custom transport pentru Email
class EmailTransport extends Transport {
  constructor(options) {
    super(options);
    this.transporter = options.transporter;
    this.from = options.from;
    this.to = options.to;
    this.level = options.level || "error";
    this.isVerified = options.isVerified || false;
  }

  log(info, callback) {
    if (!this.transporter || !this.isVerified) {
      return callback();
    }

    const { level, message, ...meta } = info;

    // Trimite email doar pentru erori critice
    if (level === "error") {
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject: "Summaris API - Error Alert",
        text: `${message}\n\n${JSON.stringify(meta, null, 2)}`,
        html: `<pre>${message}\n\n${JSON.stringify(meta, null, 2)}</pre>`,
      };

      this.transporter.sendMail(mailOptions).catch((err) => {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to send log email:", err.message);
        }
      });
    }

    callback();
  }
}

// Configurare transport email cu nodemailer
const createEmailTransport = async () => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    return null;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
    return new EmailTransport({
      transporter,
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.LOG_EMAIL_RECIPIENTS || process.env.SMTP_USER,
      level: "error",
      isVerified: true,
    });
  } catch (error) {
    console.error("Email transport configuration failed:", error.message);
    if (
      error.message.includes("BadCredentials") ||
      error.message.includes("Invalid login")
    ) {
      console.error(
        "SMTP authentication failed. For Gmail, you need to use an App Password instead of your regular password."
      );
      console.error("See: https://support.google.com/accounts/answer/185833");
      console.error(
        "Email alerts will be disabled until SMTP is properly configured."
      );
    }
    // Returnează null pentru a dezactiva transportul dacă autentificarea eșuează
    return null;
  }
};

// Creează logger-ul principal
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "summaris-api" },
  transports: [
    // Console transport (pentru development)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          ({ timestamp, level, message, ...meta }) =>
            `${timestamp} [${level}]: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
            }`
        )
      ),
    }),
    // File transport pentru toate logurile
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

// Adaugă transportul Slack dacă este configurat
if (process.env.SLACK_WEBHOOK_URL) {
  logger.add(
    new SlackTransport({
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
      level: "error",
    })
  );
}

(async () => {
  try {
    const emailTransport = await createEmailTransport();
    if (emailTransport) {
      logger.add(emailTransport);
    }
  } catch (error) {
    console.error("Failed to initialize email transport:", error.message);
  }
})();

// Helper functions pentru logging
export const logError = (message, error, meta = {}) => {
  logger.error(message, {
    ...meta,
    error: error?.message,
    stack: error?.stack,
  });
};

export const logInfo = (message, meta = {}) => {
  logger.info(message, meta);
};

export const logWarn = (message, meta = {}) => {
  logger.warn(message, meta);
};

export const logDebug = (message, meta = {}) => {
  logger.debug(message, meta);
};

export default logger;
