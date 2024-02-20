import sqlite from "sqlite3";
import { QueueAsyncGenerator } from "../utils/queue-async-generator";
import { SqlQuery } from "./sql/query";
import { AsyncDatabase } from "./async-database";
import { handleVoid, handleValued } from "../utils/promisify";

export class SQLiteAsyncDatabase implements AsyncDatabase {
  private closed = false;

  constructor(
    private readonly _db: sqlite.Database,
  ) { }

  run(sql: string, ...params: unknown[]) {
    return handleVoid
      .intoPromise(handler => this._db.run(sql, params, handler));
  }

  exec(sql: string): Promise<void> {
    return handleVoid
      .intoPromise(handler => this._db.exec(sql, handler));
  }

  all<T>(query: SqlQuery): Promise<T[]> {
    return handleValued
      .intoPromise<T[]>(handler => this._db.all<T>(query.sql, query.params, handler));
  }

  get<T>(query: SqlQuery): Promise<T | undefined> {
    return handleValued
      .intoPromise<T | undefined>(handler => this._db.get(query.sql, query.params, handler));
  }

  each<T>(query: SqlQuery): QueueAsyncGenerator<T> {
    return new QueueAsyncGenerator<T>(gen => this._db.each<T>(
      query.sql,
      query.params,
      gen.createYieldHandler(),
      gen.createDoneHandler(),
    ));
  }

  async close(): Promise<void> {
    if (this.closed) return;

    await handleVoid
      .intoPromise(handler => this._db.close(handler));

    this.closed = true;
  }

  static connect(path: string): Promise<AsyncDatabase> {
    return new Promise((res, rej) => {
      const db = new SQLiteAsyncDatabase(new sqlite.Database(path, err => {
        if (err) rej(err);

        res(db);
      }));
    });
  }

  static memory(): Promise<AsyncDatabase> {
    return this.connect(':memory:');
  }
}