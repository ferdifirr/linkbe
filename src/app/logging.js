import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Setup Daily Rotate File for logging
const transport = new DailyRotateFile({
  filename: "logs/application-%DATE%.log", // Menyimpan file log berdasarkan tanggal
  datePattern: "YYYY-MM-DD", // Format penamaan berdasarkan tanggal
  zippedArchive: true, // Arsipkan file lama dalam bentuk zip
  maxSize: "20m", // Ukuran maksimal per file log
  maxFiles: "14d", // Hapus log lebih dari 14 hari
});

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    transport,
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exceptions.log" }),
  ],
});
