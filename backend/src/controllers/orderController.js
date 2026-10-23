import { orders } from '../data/mockStore.js';

export const getOrders = (req, res) => {
  const { status, phone } = req.query;
  let result = [...orders];

  if (status && status !== 'all') {
    result = result.filter((o) => o.status === status);
  }

  if (phone) {
    result = result.filter((o) => o.customerPhone.includes(phone));
  }

  return res.json({ success: true, count: result.length, data: result });
};

export const getOrderById = (req, res) => {
  const { id } = req.params;
  const order = orders.find((o) => o.id.toLowerCase() === id.toLowerCase());
  if (!order) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
  }
  return res.json({ success: true, data: order });
};

export const createOrder = (req, res) => {
  const {
    customerName,
    customerPhone,
    shippingAddress,
    items,
    paymentMethod,
    voucherCode,
    discountAmount = 0,
    shippingFee = 20000,
    totalAmount,
    note,
  } = req.body;

  if (!customerName || !customerPhone || !shippingAddress || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đủ thông tin nhận hàng và món ăn' });
  }

  const orderId = `AV-${Math.floor(10000 + Math.random() * 90000)}`;
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newOrder = {
    id: orderId,
    customerName,
    customerPhone,
    shippingAddress,
    orderDate: dateStr,
    status: 'pending',
    paymentMethod: paymentMethod || 'cod',
    paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
    shippingFee,
    discountAmount,
    voucherCode: voucherCode || null,
    totalAmount,
    note: note || '',
    items,
  };

  orders.unshift(newOrder);
  return res.status(201).json({
    success: true,
    message: 'Đặt hàng thành công',
    data: newOrder,
  });
};

export const updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;

  const order = orders.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
  }

  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  return res.json({ success: true, message: 'Cập nhật trạng thái đơn hàng thành công', data: order });
};
