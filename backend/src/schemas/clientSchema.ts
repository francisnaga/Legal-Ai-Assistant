
import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  contact_info: z.string().optional(),
});
