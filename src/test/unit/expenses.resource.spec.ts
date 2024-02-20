import { describe, expect, test } from "vitest";
import { ExpensesResource, IExpensesService } from "../../resources/expenses.resource";
import { TODO } from "../../dev/types";
import { ListExpensesOptions, listExpensesOptionsSchema } from "../../dtos/query-params/expenses.list.query";

export class ExpensesServiceMock implements IExpensesService {
  async list(options: ListExpensesOptions): Promise<TODO[]> {
    return [];
  }
}

describe(ExpensesResource, () => {
  describe(ExpensesResource.prototype.list, () => {
    test(`Shold return 200`, async () => {
      const resource = new ExpensesResource(
        new ExpensesServiceMock(),
      );

      const options = listExpensesOptionsSchema.parse({});

      const resp = await resource.list(options); 

      expect(resp.status)
        .toStrictEqual(200);
    });
  })
})