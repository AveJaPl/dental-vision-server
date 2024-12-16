import express, { Application, Request, Response, NextFunction } from 'express';
import router from './routes';
import morgan from 'morgan';
import chalk from 'chalk';
import logger from './logger';

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
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', 'https://dental-vision.netlify.app');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Główne trasy aplikacji
app.use('/', router);

// Obsługa błędów (centralny handler błędów)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).send('Internal Server Error');
});
