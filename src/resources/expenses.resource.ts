import { TODO } from '../dev/types';
import { ListExpensesOptions } from '../dtos/query-params/expenses.list.query';
import { Response, ResponseBuilder } from '../routes/async-end-point';
import { IExpensesResource } from '../routes/expenses.router';
import { ExpensesService } from '../services/expenses.service';

export interface IExpensesService {
  list(options: ListExpensesOptions): Promise<TODO[]>;
}

export class ExpensesResource implements IExpensesResource {
  constructor(
    readonly service: IExpensesService = new ExpensesService(),
  ) { }

  async list(options: ListExpensesOptions): Promise<Response> {
    const reuslt = await this.service.list(options);

    return ResponseBuilder
      .ok(reuslt)
      .build();
  }
}