import { z } from "zod";
import { TipTapDocumentSchema } from "./content.schema";

export const getMessageDataSchema = z.object({
  id: z.string().uuid(),
  hint: z.string().nullable().optional(),
  from: z.string().nullable().optional(),
  to: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type GetMessageData = z.infer<typeof getMessageDataSchema>;

export const readMessageDataSchema = z.object({
  id: z.string().uuid(),
  content: TipTapDocumentSchema,
  from: z.string().nullable().optional(),
  to: z.string().nullable().optional(),
  hint: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type ReadMessageData = z.infer<typeof readMessageDataSchema>;
