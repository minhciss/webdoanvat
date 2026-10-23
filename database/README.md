# Hướng dẫn Cơ sở Dữ liệu - ĂnVặtPro

Thư mục này chứa toàn bộ thiết kế DDL/DML và tài liệu cơ sở dữ liệu của dự án.

## Danh sách file
- `schema.sql`: Khởi tạo database, cấu trúc các bảng và thiết lập khóa chính, khóa ngoại, chỉ mục (Index).
- `seed.sql`: Dữ liệu mẫu ban đầu (Danh mục, Sản phẩm, Voucher, Tài khoản mẫu, Đơn hàng, Đánh giá, Lịch sử thao tác).
- `erd.md`: Sơ đồ thực thể quan hệ Entity-Relationship Diagram dạng Mermaid chuẩn báo cáo đồ án.

## Cách chạy Script (MySQL / MariaDB / XAMPP / Laragon)

### Cách 1: Chạy qua dòng lệnh (Command Line / Terminal)
```bash
# Đăng nhập MySQL và tạo DB kèm bảng
mysql -u root -p < database/schema.sql

# Nạp dữ liệu mẫu
mysql -u root -p < database/seed.sql
```

### Cách 2: Sử dụng phpMyAdmin / DBeaver / Navicat / MySQL Workbench
1. Mở công cụ quản trị (ví dụ: `http://localhost/phpmyadmin` hoặc MySQL Workbench).
2. Vào thẻ **SQL** hoặc mở file `database/schema.sql` rồi nhấn **Execute / Thực thi**.
3. Tiếp tục mở file `database/seed.sql` và nhấn **Execute / Thực thi**.
