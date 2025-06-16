import { z } from 'zod';
import { TipTapDocumentSchema } from './content.schema';

export const readMessageBodySchema = z.object({
  password: z.string().optional(),
});
export type ReadMessageBody = z.infer<typeof readMessageBodySchema>;

export const updatePasswordBodySchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(1, 'New password is required'),
  newHint: z.string().optional(),
});
export type UpdatePasswordBody = z.infer<typeof updatePasswordBodySchema>;

export const updateContentBodySchema = z.object({
  password: z.string().optional(),
  newContent: TipTapDocumentSchema,
});
export type UpdateContentBody = z.infer<typeof updateContentBodySchema>;
