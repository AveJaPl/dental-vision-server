import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize } = format;

// Definicja formatu logów
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// Logger
const logger = createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        colorize(), // Kolorowanie poziomów logów
        logFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/app.log' }) // Logi do pliku
    ]
});

export default logger;
