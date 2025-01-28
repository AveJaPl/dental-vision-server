import express, { Application, Request, Response, NextFunction } from 'express';
import router from './routes';
import morgan from 'morgan';
import chalk from 'chalk';
import logger from './logger';
import cors from 'cors';
import passport from './config/passport';
import cookieParser from 'cookie-parser';

export const app: Application = express();

// Middleware, np. parsowanie JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware: logowanie żądań HTTP z użyciem morgan + chalk
app.use(
  morgan((tokens, req, res) => {
    return [
      chalk.blue(tokens.method(req, res)),
      chalk.green(tokens.url(req, res)),
      chalk.yellow(tokens.status(req, res)),
      chalk.magenta(tokens['response-time'](req, res) + ' ms'),
    ].join(' ');
  })
);

// Middleware: zabezpieczenia CORS
app.use(
  cors({
    origin: ['https://dental-vision.netlify.app'], // localhost dla developmentu, netlify dla produkcji
    credentials: true, // ważne, aby przeglądarka wysyłała/zapisywała cookie
  })
);
app.use(cookieParser());

// --- Inicjalizacja passport
app.use(passport.initialize());

// Główne trasy aplikacji
app.use('/', router);

// Obsługa błędów (centralny handler błędów)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).send('Internal Server Error');
});
