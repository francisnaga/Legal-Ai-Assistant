
import express from 'express';
import { getCases, createCase, updateCase, deleteCase } from '../controllers/caseController';
import { requireAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { caseSchema } from '../schemas/caseSchema';

const router = express.Router();

router.get('/', requireAuth, getCases);
router.post('/', requireAuth, validateRequest(caseSchema), createCase);
router.put('/:id', requireAuth, validateRequest(caseSchema), updateCase);
router.delete('/:id', requireAuth, deleteCase);

export default router;
