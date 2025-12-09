import { Router } from 'express';
import { sendContactEmail } from '../controllers/contactController';
import { contactRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/contact', contactRateLimiter, sendContactEmail);

export default router;


