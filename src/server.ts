import { app } from './app';
import logger from './logger';

const port = process.env.PORT || 3001;

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});
