
import { z } from 'zod';

export const chatSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  sessionId: z.string().uuid().optional(),
});
