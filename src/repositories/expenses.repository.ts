import { ExpenseEntity, ExpenseModel } from "../models/expenses.model";
import { SQLiteAsyncDatabase } from "../database/async-sqlite";
import { ApiLogger } from "../logger";
import { ListExpensesOptions } from "../dtos/query-params/expenses.list.query";
import { IExpensesRepository } from "../services/expenses.service";
import { insertInto, select } from "../database/sql";
import { SKIP_FILTER } from "../database/sql/where.builder";
import { AsyncDatabase } from "../database/async-database";
import { SqlQuery } from "../database/sql/query";

export type DatabaseConnector = () => Promise<AsyncDatabase>;

export class ExpensesRepository implements IExpensesRepository {
  readonly logger = ApiLogger(this);

  constructor(
    readonly connector: DatabaseConnector = () => SQLiteAsyncDatabase.connect('data.db'),
  ) { }

  async list(options: ListExpensesOptions): Promise<ExpenseModel[]> {
    const {
      categories = 'all',
      page = 0,
      pageSize = 20,
      start,
      end,
    } = options;

    const db = await this.connector();

    const query = select('*')
      .from('Expenses')
      .where('category IN (?)', categories === 'all' ? SKIP_FILTER : categories)
      .and('date_millis > ?', start?.getTime() ?? SKIP_FILTER)
      .and('date_millis < ?', end?.getTime() ?? SKIP_FILTER)
      .page(page)
      .take(pageSize)
      .build();

    this.logger.log('info', 'executring sql: %s\nwith params: ', query.sql, query.params);

    const expenses = await db
      .all<ExpenseEntity>(query)
      .then(models => models.map(model => ExpenseModel.from(model)))
      .finally(() => db.close());

    return expenses;
  }
  // TODO
  async save(model: ExpenseModel): Promise<ExpenseModel> {
    const db = await this.connector();

    const query = model.id === null
      ? insertInto('Expenses')
        .value('category', model.category.value)
        .value('amount', model.amount.value)
        .value('date_millis', new Date().getTime())
        .build()
      : new SqlQuery('TODO');

    db.close();

    return model;
  }
}