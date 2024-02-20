import { RequestHandler, Router } from "express";
import { ExpensesResource } from "../resources/expenses.resource";
import { EndPoint, Response } from "./async-end-point";
import { IRouter } from "./router-stack";
import { ListExpensesOptions, listExpensesOptionsSchema } from "../dtos/query-params/expenses.list.query";

export interface IExpensesResource {
  list(options: ListExpensesOptions): Promise<Response>;
}

export class ExpensesRouter implements IRouter {
  private router = Router();
  private basePath = '/expenses';

  constructor(
    readonly resource: IExpensesResource = new ExpensesResource(),
  ) {
    this.router.get('/', EndPoint.from(req => this.resource.list(
      listExpensesOptionsSchema.parse(req.query),
    )));
  }

  getHandler(): RequestHandler {
    return this.router;
  }

  getBasePath() {
    return this.basePath;
  }
}