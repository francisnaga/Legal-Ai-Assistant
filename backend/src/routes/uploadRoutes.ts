
import express from 'express';
import { uploadDocument } from '../controllers/uploadController';
import { requireAuth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

router.post('/', requireAuth, upload.single('document'), uploadDocument);

export default router;
