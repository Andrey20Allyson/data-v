import { describe, test } from "vitest";
import { ExpensesResource } from "../../resources/expenses.resource";
import { ExpensesRepository } from "../../repositories/expenses.repository";
import { ExpensesService } from "../../services/expenses.service";
import { SQLiteAsyncDatabase } from "../../database/async-sqlite";
import { Amount, Category, ExpenseModel } from "../../models/expenses.model";

describe(ExpensesResource, async () => {
  const repos = new ExpensesRepository(() => SQLiteAsyncDatabase.memory());
  const service = new ExpensesService(repos);
  const resource = new ExpensesResource(service);

  await repos.save(
    new ExpenseModel(
      null,
      new Amount(4000),
      new Category('CategoryA'),
      new Date(),
    ),
  );

  describe(ExpensesResource.prototype.list, () => {
    test(`Shold return only requested categories`, () => {
      const categories = resource.list({ categories: ['CategoryA'] })
    });
  });
});