<div align="center">

# 🍟 ĂnVặtPro - Website Đặt Đồ Ăn Vặt Trực Tuyến
### Đồ án môn học: **Công nghệ phần mềm (HK1 2026 - 2027)**

[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%208-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%26%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Container-Docker%20%26%20Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL%208.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)

---

<p align="center">
  <b>Hệ thống thương mại điện tử chuyên biệt cho ẩm thực ăn vặt đường phố Việt Nam</b><br>
  Tích hợp đặt món real-time, tùy chọn độ cay, thanh toán đa kênh (VietQR, COD, MoMo) và bảng điều khiển quản trị toàn diện.
</p>

</div>

---

## 📌 1. Giới Thiệu Dự Án

**ĂnVặtPro** là giải pháp phần mềm web trọn gói giải quyết bài toán đặt món và quản trị vận hành cho các chuỗi / cửa hàng đồ ăn vặt hiện đại. Dự án được thiết kế và triển khai tuân theo các nguyên lý công nghệ phần mềm: phân tầng độc lập (**3-Tier Architecture**), chuẩn hóa cơ sở dữ liệu (**3NF**), tài liệu hóa API chuẩn RESTful và đóng gói triển khai tự động hóa bằng **Docker**.

### 🌟 Tính năng nổi bật

#### 🛍️ Phân hệ Khách hàng (Customer)
- **Menu trực quan**: Khám phá các món ăn vặt "hot trend" (Bánh tráng sốt bơ trứng muối, Cá viên chiên mắm, Chân gà sốt Thái, Chè khúc bạch, Trà mãng cầu...).
- **Tùy biến cấp độ cay đặc trưng**: *Không cay (❄️)*, *Cay nhẹ (🌶️)*, *Cay vừa (🌶️🌶️)*, *Cay tê tái (🔥🌶️🔥)*.
- **Giỏ hàng & Khuyến mãi**: Quản lý số lượng thời gian thực, tự động tính tổng tiền và áp dụng mã Voucher (`ANVAT20`, `ANVAT50`, `FREESHIP`...).
- **Thanh toán linh hoạt**:
  - Tiền mặt khi nhận hàng (COD).
  - Tự động sinh mã **VietQR chuẩn NAPAS** có sẵn số tiền và nội dung chuyển khoản.
  - Ví điện tử MoMo & VNPay.
- **Theo dõi đơn hàng (Order Tracking)**: Timeline trạng thái đơn hàng trực quan (*Chờ xác nhận -> Đã duyệt -> Đang giao -> Hoàn tất*).

#### 🛡️ Phân hệ Quản trị (Admin)
- **Bảng điều khiển (Dashboard)**: Thống kê doanh thu, đơn hàng hoàn tất, tỷ lệ hủy đơn và tổng quan sản phẩm.
- **Cảnh báo tồn kho**: Tự động phát tín hiệu cảnh báo nguyên liệu/món có tồn kho thấp ($\le 5$).
- **Quản lý đơn hàng & sản phẩm**: Thêm, sửa, xóa món ăn, cập nhật trạng thái đơn hàng.
- **Nhật ký hệ thống (Audit Logs)**: Lưu vết chi tiết lịch sử thao tác của các quản trị viên.

---

## 🏗️ 2. Kiến Trúc Hệ Thống (3-Tier Architecture)

Dự án được phân chia độc lập thành 3 thành phần chính:

```text
webdoanvat/
├── 📂 frontend/               # Tầng Trình diễn (Presentation Layer)
│   ├── public/                # Tài nguyên tĩnh, icon, favicon
│   ├── src/
│   │   ├── assets/            # Hình ảnh sản phẩm, banner
│   │   ├── components/        # Component React (Navbar, Cart, Checkout, Admin, ...)
│   │   ├── context/           # AppContext quản lý state tập trung
│   │   ├── data/              # Dữ liệu mockData khởi tạo
│   │   ├── App.jsx, main.jsx  # Điểm vào ứng dụng
│   │   └── index.css          # Tailwind CSS v4 styling
│   ├── vite.config.js         # Cấu hình Vite bundler
│   ├── package.json           # Thư viện Frontend (React 19, Lucide, Tailwind, Confetti)
│   └── README.md
│
├── 📂 backend/                # Tầng Ứng dụng & Dịch vụ (Application / API Layer)
│   ├── src/
│   │   ├── config/            # Cấu hình biến môi trường (Port, CORS, DB)
│   │   ├── controllers/       # Xử lý logic (Auth, Product, Order, Voucher, Review, Admin)
│   │   ├── routes/            # REST API Routes (/api/products, /api/orders, ...)
│   │   ├── middlewares/       # Middleware tập trung bắt lỗi và xác thực
│   │   ├── data/              # Dữ liệu in-memory đồng bộ tức thì
│   │   └── server.js          # Khởi động Express Server
│   ├── Dockerfile             # Container image cấu hình Node.js 20 Alpine
│   ├── .dockerignore          # Bỏ qua node_modules khi build
│   ├── .env.example           # File mẫu biến môi trường
│   ├── package.json           # Thư viện Express, CORS, Dotenv
│   └── README.md
│
├── 📂 database/               # Tầng Dữ liệu (Data Tier)
│   ├── schema.sql             # DDL: Tạo 8 bảng quan hệ có khóa ngoại & index
│   ├── seed.sql               # DML: Dữ liệu khởi tạo món ăn, danh mục, tài khoản mẫu
│   ├── erd.md                 # Bản vẽ sơ đồ thực thể quan hệ ERD (Mermaid)
│   └── README.md              # Hướng dẫn nạp CSDL vào MySQL / MariaDB
│
├── docker-compose.yml         # File phối hợp khởi chạy Backend + MySQL tự động
├── package.json               # Root monorepo scripts chạy dự án
└── README.md                  # Tổng quan dự án (File này)
```

---

## 🗄️ 3. Cơ Sở Dữ Liệu & Sơ Đồ Thực Thể (ERD)

Cơ sở dữ liệu bao gồm 8 bảng chính với các mối quan hệ chặt chẽ:
- **`users`**: Tài khoản khách hàng & quản trị viên.
- **`categories`**: Danh mục đồ ăn vặt (Bánh tráng, Đồ chiên, Cay tê, Nước giải khát...).
- **`products`**: Chi tiết món, giá bán, giá gốc, tồn kho, cấp độ cay, ảnh.
- **`vouchers`**: Mã giảm giá, điều kiện áp dụng, hạn dùng.
- **`orders`**: Thông tin đơn hàng, tổng tiền, phương thức thanh toán, địa chỉ.
- **`order_items`**: Chi tiết các món trong đơn hàng và cấp độ cay khách đã chọn.
- **`reviews`**: Đánh giá và số sao từ khách hàng.
- **`audit_logs`**: Nhật ký truy vết thao tác quản trị.

Chi tiết sơ đồ Mermaid và từ điển dữ liệu xem tại [database/erd.md](database/erd.md).

---

## 🚀 4. Hướng Dẫn Cài Đặt & Khởi Chạy

### ⚙️ Yêu cầu môi trường
- [Node.js](https://nodejs.org/) version 18.x trở lên
- [Docker Desktop](https://www.docker.com/) (Tùy chọn nếu muốn chạy container)
- [Git](https://git-scm.com/)

---

### Cách 1: Khởi chạy bằng Docker *(Khuyên dùng)*

1. Đảm bảo ứng dụng **Docker Desktop** đã được mở trên máy tính.
2. Tại thư mục gốc dự án:
   ```bash
   # Khởi chạy Backend container:
   npm run docker:backend:build
   npm run docker:backend:run

   # Hoặc khởi chạy cả Backend + MySQL tự động nạp DB:
   npm run docker:up
   ```
3. Mở thêm terminal và khởi chạy Frontend:
   ```bash
   npm run dev:frontend
   ```

---

### Cách 2: Khởi chạy truyền thống với Node.js (Không dùng Docker)

#### 1. Khởi chạy Backend:
```bash
cd backend
npm install
npm run dev
```
👉 API Server lắng nghe tại: **`http://localhost:5000`**

#### 2. Khởi chạy Frontend:
```bash
cd frontend
npm install
npm run dev
```
👉 Web ứng dụng hiển thị tại: **`http://localhost:5173`**

---

## 📡 5. Danh Sách API Endpoints Chính

| Phương thức | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Kiểm tra trạng thái hoạt động của server |
| `GET` | `/api/products` | Lấy danh sách món ăn (hỗ trợ lọc danh mục, tìm kiếm, sắp xếp) |
| `GET` | `/api/products/categories` | Lấy danh mục các nhóm món |
| `GET` | `/api/products/:id` | Xem thông tin chi tiết một món ăn |
| `POST` | `/api/orders` | Tạo đơn hàng mới |
| `GET` | `/api/orders` | Danh sách đơn hàng (Admin/Khách) |
| `PATCH` | `/api/orders/:id/status` | Cập nhật trạng thái đơn (Pending, Confirmed, Shipping, ...) |
| `POST` | `/api/vouchers/check` | Kiểm tra tính hợp lệ của mã giảm giá |
| `GET` | `/api/admin/stats` | Thống kê doanh thu, đơn hàng, cảnh báo tồn kho |

---

## 👥 6. Thông Tin Dự Án & Tác Giả

- **Môn học**: Công nghệ phần mềm
- **Học kỳ**: HK1 (2026 - 2027)
- **Tác giả / GitHub**: [@minhciss](https://github.com/minhciss)
- **Kho lưu trữ chính**: [https://github.com/minhciss/webdoanvat.git](https://github.com/minhciss/webdoanvat.git)

---

<div align="center">
  <sub>Dự án được xây dựng phục vụ học tập và nghiên cứu Công nghệ phần mềm. Made with ❤️ in Vietnam.</sub>
</div>
