import express from 'express';
import { RouterStack } from './routes/router-stack';
import { ExpensesRouter } from './routes/expenses.router';
import { errorLoggingMiddleware, requestLoggingMiddleware } from './logger/log.middleware';

const app = express();

const routes = new RouterStack([
  new ExpensesRouter(),
]);

app.use(
  requestLoggingMiddleware(),
  errorLoggingMiddleware(),
);

routes.handle(app);

app.listen(3000, () => {
  console.log('app is listening at localhost:3000');
});