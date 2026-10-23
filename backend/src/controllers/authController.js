import { users } from '../data/mockStore.js';

export const login = (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email không được để trống' });
  }

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại' });
  }

  // Giả lập token đăng nhập
  const token = `fake-jwt-token-${user.id}-${Date.now()}`;
  return res.json({
    success: true,
    message: 'Đăng nhập thành công',
    token,
    user,
  });
};

export const register = (req, res) => {
  const { name, email, phone, address } = req.body;
  if (!email || !name) {
    return res.status(400).json({ success: false, message: 'Họ tên và email là bắt buộc' });
  }

  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'Email đã được đăng ký' });
  }

  const newUser = {
    id: `USR-${Date.now().toString().slice(-4)}`,
    name,
    email,
    phone: phone || '',
    address: address || '',
    role: 'customer',
    points: 50, // Thưởng 50 điểm thành viên mới
  };

  users.push(newUser);
  return res.status(201).json({
    success: true,
    message: 'Đăng ký thành công',
    user: newUser,
  });
};

export const getProfile = (req, res) => {
  const user = users[0]; // Mặc định người dùng hiện tại
  return res.json({ success: true, user });
};
