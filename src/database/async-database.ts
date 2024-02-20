import { QueueAsyncGenerator } from "../utils/queue-async-generator";
import { SqlQuery } from "./sql/query";

export interface AsyncDatabase {
  run(sql: string, ...params: unknown[]): Promise<void>;
  exec(sql: string): Promise<void>;
  all<T>(query: SqlQuery): Promise<T[]>;
  get<T>(query: SqlQuery): Promise<T | undefined>;
  each<T>(query: SqlQuery): QueueAsyncGenerator<T>;
  close(): Promise<void>;
}