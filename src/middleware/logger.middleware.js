import winston from 'winston';
import enviroment from '../tools/config.js';

const levels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
};

const colors = {
    fatal: 'red',
    error: 'red',
    warning: 'yellow',
    info: 'green',
    http: 'blue',
    debug: 'blue',
    
};

winston.addColors(colors);

let logger;

const logFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  );
  
  if (enviroment.ENVIROMENT === 'dev') {
      logger = winston.createLogger({
          levels: levels,
          format: logFormat,
          transports: [
              new winston.transports.Console({ level: 'debug' }),
              new winston.transports.File({ filename: 'errors.log', level: 'error' }),

          ],
      });
  }
  
  if (enviroment.ENVIROMENT === 'prod') {
      logger = winston.createLogger({
          levels: levels,
          format: logFormat,
          transports: [
              new winston.transports.Console({ level: 'info' }),
              new winston.transports.File({ filename: 'errors.log', level: 'error' }),
          ],
      });
  }

export const loggerMiddleware = (req, res, next) => {
    req.logger = logger;
    logger.info(`${req.method} - ${req.url} - [${req.ip}] - ${req.get('user-agent')} - ${new Date().toISOString()}`);
    next();
}

export default logger
