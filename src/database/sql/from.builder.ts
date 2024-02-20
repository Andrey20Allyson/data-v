import { PageInfo } from "./page";
import { SqlQueryBuilder, SqlQuery } from "./query";
import { SelectFromSQLBuilder } from "./select-from-query.builder";
import { SelectBuilder } from "./select.builder";
import { WhereBuilder, WhereExprStack } from "./where.builder";

export class FromBuilder implements SqlQueryBuilder {
  constructor(
    readonly table: string,
    readonly selectBuilder: SelectBuilder,
    readonly pageInfo?: PageInfo,
  ) { }

  where(expr: string, ...params: unknown[]): WhereBuilder {
    return new WhereBuilder(
      new WhereExprStack().put(expr, params),
      this,
    )
  }

  page(index: number): FromBuilder {
    const pageInfo = this.pageInfo ?? new PageInfo();

    return new FromBuilder(
      this.table,
      this.selectBuilder,
      pageInfo.page(index),
    );
  }

  take(size: number): FromBuilder {
    const pageInfo = this.pageInfo ?? new PageInfo();

    return new FromBuilder(
      this.table,
      this.selectBuilder,
      pageInfo.take(size),
    );
  }

  build(): SqlQuery {
    return new SelectFromSQLBuilder(
      this.selectBuilder.selector,
      this.table,
      undefined,
      this.pageInfo,
    ).build();
  }
}
