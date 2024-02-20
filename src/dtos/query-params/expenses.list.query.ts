import { z } from "zod";

export const listExpensesOptionsSchema = z.object({
  start: z
    .date({ coerce: true })
    .optional(),
  end: z
    .date({ coerce: true })
    .optional(),
  categories: z
    .string()
    .array()
    .or(z.enum(['all']))
    .optional(),
    page: z
    .number({ coerce: true })
    .optional(),
    pageSize: z
    .number({ coerce: true })
    .optional(),
});

export interface ListExpensesOptions extends z.infer<typeof listExpensesOptionsSchema> { }