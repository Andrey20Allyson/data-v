import { RequestHandler, Router, Express } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export interface IRouter {
  getHandler(): RequestHandler;
  getBasePath(): string;
}

export class RouterStack implements IRouter {
  private router = Router();
  private basePath = '/';

  constructor(routes: IRouter[]) {
    for (const router of routes) {
      this.router.get(router.getBasePath(), router.getHandler());
    }
  }

  getBasePath(): string {
    return this.basePath;
  }

  getHandler(): RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>> {
    return this.router;
  }

  handle(app: Express): void {
    app.use(
      this.getBasePath(),
      this.getHandler(),
    );
  }
}