import express from 'express';
import { getVouchers, checkVoucher, createVoucher } from '../controllers/voucherController.js';

const router = express.Router();

router.get('/', getVouchers);
router.post('/check', checkVoucher);
router.post('/', createVoucher);

export default router;
