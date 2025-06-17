import { z } from 'zod';

export const createMessageBodySchema = z.object({
  content: z.string().optional(),
  messageId: z.string().optional(),
  initialPassword: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});
export type CreateMessageBody = z.infer<typeof createMessageBodySchema>;

export const updateMessageBodySchema = z.object({
  content: z.string().min(1, 'Message content is required'),
  password: z.string().optional(),
  hint: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});
export type UpdateMessageBody = z.infer<typeof updateMessageBodySchema>;
