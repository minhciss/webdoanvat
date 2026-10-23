# Frontend - ĂnVặtPro (Web Đồ Ăn Vặt)

Giao diện người dùng hiện đại xây dựng bằng **React 19**, **Vite** và **Tailwind CSS**.

## Tính năng nổi bật
- 🛍️ **Trang chủ & Menu**: Xem danh sách món ăn, lọc theo danh mục, tìm kiếm món, sắp xếp giá/đánh giá, chọn cấp độ cay (Không cay / Cay nhẹ / Cay vừa / Cay tê tái).
- 🛒 **Giỏ hàng & Đặt hàng**: Quản lý giỏ hàng real-time, áp dụng mã voucher giảm giá, chọn phương thức thanh toán (COD, VietQR tạo mã QR tự động, MoMo, VNPay).
- 📍 **Theo dõi đơn hàng**: Kiểm tra hành trình đơn hàng trực quan qua timeline các bước.
- ⚙️ **Bảng điều khiển Admin**: Quản lý danh mục, món ăn, cập nhật đơn hàng, theo dõi cảnh báo kho hàng khi tồn kho <= 5, thống kê doanh thu và audit log.

## Hướng dẫn cài đặt & Khởi chạy

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt thư viện
npm install

# Chạy server phát triển (HMR)
npm run dev

# Đóng gói sản phẩm (Build production)
npm run build
```
Mặc định ứng dụng chạy tại: `http://localhost:5173`
