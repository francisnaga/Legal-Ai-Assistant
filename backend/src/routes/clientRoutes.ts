
import express from 'express';
import { getClients, createClient, updateClient, deleteClient } from '../controllers/clientController';
import { requireAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { clientSchema } from '../schemas/clientSchema';

const router = express.Router();

router.get('/', requireAuth, getClients);
router.post('/', requireAuth, validateRequest(clientSchema), createClient);
router.put('/:id', requireAuth, validateRequest(clientSchema), updateClient);
router.delete('/:id', requireAuth, deleteClient);

export default router;
