import { vouchers } from '../data/mockStore.js';

export const getVouchers = (req, res) => {
  return res.json({ success: true, count: vouchers.length, data: vouchers });
};

export const checkVoucher = (req, res) => {
  const { code, orderTotal = 0 } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Chưa nhập mã giảm giá' });
  }

  const v = vouchers.find((item) => item.code.toUpperCase() === code.trim().toUpperCase());
  if (!v) {
    return res.status(404).json({ success: false, message: 'Mã voucher không tồn tại hoặc đã hết hạn' });
  }

  if (orderTotal < v.minOrder) {
    return res.status(400).json({
      success: false,
      message: `Đơn hàng tối thiểu phải từ ${v.minOrder.toLocaleString('vi-VN')}đ để dùng mã này`,
    });
  }

  return res.json({
    success: true,
    message: 'Áp dụng mã giảm giá thành công',
    data: v,
  });
};

export const createVoucher = (req, res) => {
  const { code, discount, minOrder, expiry, description } = req.body;
  if (!code || !discount) {
    return res.status(400).json({ success: false, message: 'Mã code và số tiền giảm là bắt buộc' });
  }

  const existing = vouchers.find((item) => item.code.toUpperCase() === code.trim().toUpperCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'Mã voucher này đã tồn tại' });
  }

  const newVoucher = {
    id: `VOUCHER-${Date.now().toString().slice(-4)}`,
    code: code.trim().toUpperCase(),
    discount: Number(discount),
    minOrder: Number(minOrder) || 0,
    expiry: expiry || '2026-12-31',
    description: description || '',
  };

  vouchers.push(newVoucher);
  return res.status(201).json({ success: true, message: 'Tạo voucher thành công', data: newVoucher });
};
