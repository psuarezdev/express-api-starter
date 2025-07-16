import { pino } from 'pino';

const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'dd/mm/yy HH:MM:ss Z'
    }
  }
});

export default logger;
