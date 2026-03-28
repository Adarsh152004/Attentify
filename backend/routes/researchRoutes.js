import express from 'express';
import multer from 'multer';
import { uploadDocument, getDocuments, getDocumentSummary, deleteDocument } from '../controllers/researchController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for memory storage (we'll process it and send to Supabase/Python)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.use(requireAuth);

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', getDocuments);
router.get('/:id/summary', getDocumentSummary);
router.delete('/:id', deleteDocument);

export default router;
