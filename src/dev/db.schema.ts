import { SQLiteAsyncDatabase } from "../database/async-sqlite";
import { SqlQuery } from "../database/sql/query";

export async function requestDBTablesSQL(path: string): Promise<string> {
  const db = await SQLiteAsyncDatabase.connect(path);

  const query = new SqlQuery('SELECT sql FROM sqlite_master WHERE type="table"');

  const res = await db.all<{ sql: string }>(query);

  return res
    .map(result => result.sql)
    .join('\n\n');
}

requestDBTablesSQL('data.db')
  .then(sql => console.log(sql));