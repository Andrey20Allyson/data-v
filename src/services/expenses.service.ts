import { TODO } from "../dev/types";
import { ListExpensesOptions } from "../dtos/query-params/expenses.list.query";
import { ApiLogger } from "../logger";
import { ExpenseEntity, ExpenseModel } from "../models/expenses.model";
import { ExpensesRepository } from "../repositories/expenses.repository";

export interface IExpensesRepository {
  list(options: ListExpensesOptions): Promise<ExpenseModel[]>;
  save(model: ExpenseModel): Promise<ExpenseModel>;
}

export class ExpensesService {
  readonly logger = ApiLogger(this);

  constructor(
    readonly repository: IExpensesRepository = new ExpensesRepository(),
  ) { }

  async list(options: ListExpensesOptions): Promise<TODO[]> {
    return this.repository.list(options);
  }
}