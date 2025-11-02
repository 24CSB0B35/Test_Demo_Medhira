import express from 'express';
import { 
  getConsultations, 
  getConsultation, 
  createConsultation,
  updateConsultation, 
  deleteConsultation 
} from '../controllers/consultationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getConsultations);
router.get('/:id', protect, getConsultation);
router.post('/', protect, createConsultation); // ← ADD THIS LINE
router.put('/:id', protect, updateConsultation);
router.delete('/:id', protect, deleteConsultation);

export default router;