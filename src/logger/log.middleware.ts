import e from "express";
import { logger } from ".";

export function requestLoggingMiddleware(): e.RequestHandler {
  return (req, _, next) => {
    logger.log('info', 'recived request from %s', req.ip)
    next();
  };
}

export function errorLoggingMiddleware(): e.ErrorRequestHandler {
  return (err, _req, _res, next) => {
    logger.log('error', 'catch error %o', err);
    next();
  };
}