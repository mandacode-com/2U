import { z } from 'zod';

export const readMessageBodySchema = z.object({
  password: z.string().optional(),
});
export type ReadMessageBody = z.infer<typeof readMessageBodySchema>;

export const updatePasswordBodySchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(1, 'New password is required'),
});
export type UpdatePasswordBody = z.infer<typeof updatePasswordBodySchema>;
