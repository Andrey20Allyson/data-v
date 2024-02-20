import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple(),
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ dirname: '.log', filename: 'error.log', level: 'error' }),
    new winston.transports.File({ dirname: '.log', filename: 'combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV === 'DEV') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export function ApiLogger(instance: {} | Function): winston.Logger {
  const name = typeof instance === 'function' ? instance.name : instance.constructor.name; 

  return logger.child({ component: name, service: 'api-service' });
}