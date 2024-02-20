import { Request, RequestHandler, Response as EResponse } from "express";

export type HeaderType = string | number | string[];

export class Response {
  headers: Map<string, HeaderType> = new Map();
  status: number = 200;
  body: unknown = null;

  applyTo(res: EResponse) {
    for (const [name, value] of this.headers) {
      res.setHeader(name, value);
    }

    res
      .status(this.status)
      .send(this.body);
  }
}

export class ResponseBuilder {
  private res = new Response();

  header(name: string, value: HeaderType): this {
    this.res.headers.set(name, value);

    return this;
  }

  created(): this {
    return this.status(201);
  }

  ok(body?: unknown): this {
    return this
      .status(200)
      .entity(body);
  }

  status(status: number): this {
    this.res.status = status;

    return this;
  }

  entity(body: unknown = null): this {
    this.res.body = this.res.body ?? body;

    return this;
  }

  build(): Response {
    return this.res;
  }

  static header(name: string, value: HeaderType): ResponseBuilder {
    return new ResponseBuilder().header(name, value);
  }

  static created(): ResponseBuilder {
    return new ResponseBuilder().created();
  }

  static status(status: number): ResponseBuilder {
    return new ResponseBuilder().status(status);
  }

  static entity(body: unknown): ResponseBuilder {
    return new ResponseBuilder().entity(body);
  }

  static ok(body?: unknown): ResponseBuilder {
    return new ResponseBuilder().ok(body);
  }
}

export module EndPoint {
  export function from(handler: (req: Request, res: EResponse) => Promise<Response>): RequestHandler {
    return (req, expressRes, next) => {
      handler(req, expressRes)
        .then(res => {
          res.applyTo(expressRes);
        })
        .catch(err => next(err));
    }
  }
}