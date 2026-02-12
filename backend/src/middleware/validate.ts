
import { type Request, type Response, type NextFunction } from 'express';
import type { ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.errors });
  }
};
