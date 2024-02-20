export interface SqlQueryBuilder {
  build(): SqlQuery;
}

export class SqlQuery {
  constructor(
    readonly sql: string,
    readonly params: unknown[] = [],
  ) { }
}