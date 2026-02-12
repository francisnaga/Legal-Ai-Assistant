import express from 'express';
import { chatWithDocument, getChatHistory } from '../controllers/chatController';
import { requireAuth } from '../middleware/auth';

import { validateRequest } from '../middleware/validate';
import { chatSchema } from '../schemas/chatSchema';

const router = express.Router();

router.post('/', requireAuth, validateRequest(chatSchema), chatWithDocument);
router.get('/:caseId', requireAuth, getChatHistory);

export default router;
