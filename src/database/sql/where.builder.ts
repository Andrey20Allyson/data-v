import { FromBuilder } from "./from.builder";
import { SqlQueryBuilder, SqlQuery } from "./query";
import { SelectFromSQLBuilder } from "./select-from-query.builder";

export type WhereLogicOpr = 'AND' | 'OR';
export const SKIP_FILTER = Symbol();

export class WhereExprStack {
  constructor(
    readonly exprs: string[] = [],
    readonly params: unknown[] = [],
  ) { }

  put(expr: string, params: unknown[], prefix: WhereLogicOpr = 'AND'): WhereExprStack {
    if (this.params.some(param => param === SKIP_FILTER)) return this;

    const numOfParamsInExpr = expr
      .split('')
      .reduce((acc, char) => char === '?' ? acc + 1 : acc, 0);

    if (numOfParamsInExpr !== params.length) {
      throw new Error(`Expression expects ${numOfParamsInExpr} params, but recived ${params.length}`);
    }

    let exprs = this.exprs.length === 0
      ? this.exprs.concat(expr)
      : this.exprs.concat(`${prefix} ${expr}`);

    return new WhereExprStack(
      exprs,
      this.params.concat(params),
    );
  }
}

export class WhereBuilder implements SqlQueryBuilder {
  constructor(
    readonly exprs: WhereExprStack,
    readonly fromBuilder: FromBuilder,
  ) { }

  and(expr: string, ...params: unknown[]): WhereBuilder {
    return this._put(expr, params, 'AND');
  }

  or(expr: string, ...params: unknown[]): WhereBuilder {
    return this._put(expr, params, 'OR');
  }

  private _put(expr: string, params: unknown[], prefix?: WhereLogicOpr) {
    return new WhereBuilder(
      this.exprs.put(expr, params, prefix),
      this.fromBuilder,
    );
  }

  page(page: number): WhereBuilder {
    return new WhereBuilder(
      this.exprs,
      this.fromBuilder.page(page),
    );
  }

  take(size: number): WhereBuilder {
    return new WhereBuilder(
      this.exprs,
      this.fromBuilder.take(size),
    );
  }

  build(): SqlQuery {
    return new SelectFromSQLBuilder(
      this.fromBuilder.selectBuilder.selector,
      this.fromBuilder.table,
      this.exprs,
      this.fromBuilder.pageInfo,
    ).build();
  }
}