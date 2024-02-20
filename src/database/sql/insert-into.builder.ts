import { SqlQuery, SqlQueryBuilder } from "./query";

export type EntityCollumnType = string | number | boolean | bigint | null | Date;

export class InsertValueStack {
  constructor(
    readonly names: string[] = [],
    readonly values: unknown[] = [],
  ) { }

  length(): number {
    return this.names.length;
  }

  put(name: string, value: EntityCollumnType): InsertValueStack {
    return new InsertValueStack(
      this.names.concat(name),
      this.values.concat(value),
    );
  }
}

export class InsertIntoBuilder implements SqlQueryBuilder {
  constructor(
    readonly table: string,
    readonly values: InsertValueStack = new InsertValueStack(),
  ) { }

  value(name: string, value: EntityCollumnType) {
    return new InsertIntoBuilder(
      this.table,
      this.values.put(name, value),
    )
  }

  build(): SqlQuery {
    const paramsTemplate = new Array(this.values.length())
      .fill('?')
      .join(', ');
    const sql = `INSERT INTO ${this.table} (${paramsTemplate}) VALUES (${paramsTemplate})`;
    const params: unknown[] = [
      ...this.values.names,
      ...this.values.values
    ];

    return new SqlQuery(
      sql,
      params,
    );
  }
}