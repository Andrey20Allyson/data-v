import { FromBuilder } from "./from.builder";

export class SelectBuilder {
  constructor(
    readonly selector: string[] = ['*'],
  ) { }

  select(selector: string): SelectBuilder {
    return new SelectBuilder(
      this.selector.concat(selector),
    );
  }

  from(table: string): FromBuilder {
    return new FromBuilder(
      table,
      this,
    );
  }
}