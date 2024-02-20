export interface ExpenseEntity {
  id: number;
  amount: number;
  category: string;
  date_millis: number;
}

export class Amount {
  constructor(readonly value: number) { }
}

export class Category {
  constructor(readonly value: string) {
    if (value.length === 0) throw new Error(`Invalid category: category can't be a empity string`);
  }
}

export class ExpenseModel {
  constructor(
    public id: number | null = null,
    public amount: Amount,
    public category: Category,
    public date: Date,
  ) { }

  static from(model: ExpenseEntity): ExpenseModel {
    return new ExpenseModel(
      model.id,
      new Amount(model.amount),
      new Category(model.category),
      new Date(model.date_millis),
    );
  }
}

export interface CategoryExpenseSumModel {
  category: string;
  amount_sum: number;
}