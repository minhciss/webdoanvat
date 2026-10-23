import express from 'express';
import { getDashboardStats, getAuditLogs } from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', getDashboardStats);
router.get('/logs', getAuditLogs);

export default router;
