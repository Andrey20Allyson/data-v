import { InsertIntoBuilder } from "./insert-into.builder";
import { SelectBuilder } from "./select.builder";

export function select(selector?: string[] | string): SelectBuilder {
  return new SelectBuilder(
    typeof selector === 'string'
      ? [selector]
      : selector,
  );
}

export function insertInto(table: string): InsertIntoBuilder {
  return new InsertIntoBuilder(table);
}