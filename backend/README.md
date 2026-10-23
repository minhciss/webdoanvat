# Backend API - ĂnVặtPro (Web Đồ Ăn Vặt)

Hệ thống RESTful API phục vụ nghiệp vụ bán hàng đồ ăn vặt trực tuyến, xây dựng trên nền tảng **Node.js** và **Express.js**.

## 1. Cài đặt và Khởi chạy

### Cách 1: Chạy bằng Docker (Khuyên dùng)
Đảm bảo bạn đã mở Docker Desktop, sau đó thực hiện:

#### 1.1 Chạy nhanh qua Docker Compose (kèm MySQL tự tạo bảng & nạp dữ liệu):
Từ thư mục gốc dự án:
```bash
docker compose up -d
```
Xem log của backend:
```bash
docker compose logs -f backend
```
Dừng hệ thống:
```bash
docker compose down
```

#### 1.2 Build & Chạy riêng Backend container:
```bash
# Di chuyển vào backend
cd backend

# Build Docker image
docker build -t webdoanvat-backend .

# Chạy container
docker run -d -p 5000:5000 --name webdoanvat_backend webdoanvat-backend
```

---

### Cách 2: Chạy trực tiếp qua Node.js (Không dùng Docker)
```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt thư viện phụ thuộc
npm install

# Khởi chạy server ở chế độ phát triển (Auto-reload)
npm run dev

# Khởi chạy chế độ sản xuất
npm start
```
Server mặc định chạy tại: `http://localhost:5000`

## 2. Cấu hình Biến Môi Trường (`.env`)
Tạo file `.env` từ `.env.example`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=webdoanvat

JWT_SECRET=super_secret_jwt_key
```

## 3. Danh sách Endpoints API chính

### 🥗 Sản phẩm & Danh mục (`/api/products`)
- `GET /api/products`: Lấy danh sách sản phẩm (hỗ trợ query `category`, `search`, `sort`)
- `GET /api/products/categories`: Lấy danh mục món ăn
- `GET /api/products/:id`: Chi tiết món ăn
- `POST /api/products`: Thêm món mới (Admin)
- `PUT /api/products/:id`: Cập nhật thông tin món (Admin)
- `DELETE /api/products/:id`: Xóa món ăn (Admin)

### 📦 Đơn hàng (`/api/orders`)
- `GET /api/orders`: Danh sách đơn hàng (hỗ trợ lọc `status`, `phone`)
- `GET /api/orders/:id`: Chi tiết đơn hàng theo mã đơn
- `POST /api/orders`: Đặt hàng mới (COD, VietQR, MoMo, VNPay)
- `PATCH /api/orders/:id/status`: Cập nhật trạng thái đơn (Pending -> Confirmed -> Shipping -> Completed)

### 🎟️ Mã giảm giá (`/api/vouchers`)
- `GET /api/vouchers`: Danh sách voucher khả dụng
- `POST /api/vouchers/check`: Kiểm tra tính hợp lệ & điều kiện áp dụng voucher
- `POST /api/vouchers`: Tạo voucher mới (Admin)

### ⭐ Đánh giá (`/api/reviews`)
- `GET /api/reviews?productId=BT-01`: Xem đánh giá của khách hàng theo sản phẩm
- `POST /api/reviews`: Gửi đánh giá và số sao

### 📊 Quản trị (`/api/admin`)
- `GET /api/admin/stats`: Báo cáo doanh thu, đơn hàng, cảnh báo tồn kho
- `GET /api/admin/logs`: Xem lịch sử thao tác hệ thống

### 🔐 Tài khoản (`/api/auth`)
- `POST /api/auth/login`: Đăng nhập
- `POST /api/auth/register`: Đăng ký tài khoản
- `GET /api/auth/profile`: Thông tin cá nhân
