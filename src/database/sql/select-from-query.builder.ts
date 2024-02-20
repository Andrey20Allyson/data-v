import { PageInfo } from "./page";
import { SqlQueryBuilder, SqlQuery } from "./query";
import { WhereExprStack } from "./where.builder";

export class SelectFromSQLBuilder implements SqlQueryBuilder {
  constructor(
    readonly selectors: string[] | string,
    readonly table: string,
    readonly whereExprs?: WhereExprStack,
    readonly pageInfo?: PageInfo,
  ) { }

  build(): SqlQuery {
    const selectorStr = typeof this.selectors === 'string' ? this.selectors : this.selectors.join(', ');
    let sql = `SELECT ${selectorStr} FROM ${this.table}`;
    const params: unknown[] = [];

    if (this.whereExprs !== undefined) {
      sql += ` WHERE ${this.whereExprs.exprs.join(' ')}`;
      params.push(...this.whereExprs.params);
    }

    if (this.pageInfo !== undefined) {
      sql += ` OFFSET ? LIMIT ?`;
      params.push(
        this.pageInfo.getOffset(),
        this.pageInfo.pageSize,
      );
    }

    return new SqlQuery(
      sql,
      params,
    );
  }
}