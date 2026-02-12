
import { z } from 'zod';

export const caseSchema = z.object({
  client_id: z.string().uuid('Invalid client ID'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  type: z.string().min(1, 'Case type is required'),
  status: z.enum(['open', 'closed']).default('open'),
});
