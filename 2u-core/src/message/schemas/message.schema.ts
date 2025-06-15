import { z } from 'zod';

export const createMessageBodySchema = z.object({
  content: z.string().optional(),
  messageId: z.string().optional(),
});

export type CreateMessageBody = z.infer<typeof createMessageBodySchema>;

export const updateMessageBodySchema = z.object({
  content: z.string().min(1, 'Message content is required'),
});

export type UpdateMessageBody = z.infer<typeof updateMessageBodySchema>;
