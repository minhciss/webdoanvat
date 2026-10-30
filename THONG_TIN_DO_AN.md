# THÔNG TIN ĐỒ ÁN CÔNG NGHỆ PHẦN MỀM

---

## 1. THÔNG TIN ĐỀ TÀI
* **Tên đề tài:** Quản lý bán hàng - Website đặt đồ ăn vặt trực tuyến (**ĂnVặtPro**)
* **Loại ứng dụng:** **Web Application**
* **Thành viên nhóm:**
  1. `[Họ và tên]` - MSSV: `[MSSV]` (**Nhóm trưởng**)
  2. `[Họ và tên]` - MSSV: `[MSSV]` (Thành viên)
* **Ngôn ngữ & Công nghệ:**
  * **Ngôn ngữ:** JavaScript (ES6+), SQL, HTML5, CSS3
  * **Frontend (GUI):** React 18, Vite, Tailwind CSS, Lucide Icons
  * **Kiến trúc (BUS):** Phân tầng 3 lớp (GUI - BUS - DAO), React Context API
  * **Cơ sở dữ liệu (DAO):** MySQL / SQL Relational Database (12 bảng chuẩn 3NF)

---

## 2. NỘI DUNG TÓM TẮT ĐỒ ÁN (Tối thiểu 10 dòng)
Website ĂnVặtPro là hệ thống thương mại điện tử phục vụ đặt và quản lý bán đồ ăn vặt trực tuyến, xây dựng theo mô hình phân tầng chuẩn mực (GUI - BUS - DAO). Hệ thống gồm hai phân hệ chính:

1. **Phân hệ Khách hàng:**
   * Duyệt thực đơn theo danh mục (Bánh tráng, đồ chiên, chân gà, tráng miệng).
   * Tìm kiếm món ăn thông minh theo từ khóa và bộ lọc theo giá/độ cay.
   * Xem chi tiết món: hình ảnh, thành phần, chọn cấp độ cay và số lượng.
   * Giỏ hàng tự động tính tiền, áp dụng mã giảm giá (voucher).
   * Đặt hàng với nhiều phương thức: Tiền mặt (COD), chuyển khoản VietQR tự động, MoMo, VNPay.
   * Tra cứu tiến độ đơn hàng và gửi đánh giá chấm sao (1 - 5 sao) kèm nhận xét.

2. **Phân hệ Quản trị (Admin):**
   * Dashboard thống kê tổng doanh thu, số lượng đơn và món bán chạy.
   * Quản lý thực đơn (CRUD): Thêm, sửa giá/ảnh, xóa món, gắn nhãn Hot/Sale.
   * Quản lý đơn hàng: Tiếp nhận, duyệt đơn, chuyển trạng thái giao hàng, hủy đơn.
   * Quản lý voucher: Tạo mã giảm giá theo số tiền hoặc phần trăm, đặt hạn dùng.
   * Quản lý khách hàng: Danh sách tài khoản, lịch sử mua sắm, khóa/mở tài khoản.
   * Quản lý đánh giá và ghi nhật ký hệ thống (Audit Logs).

---

## 3. THIẾT KẾ MÔ HÌNH CSDL QUAN HỆ (12 BẢNG)

Hệ thống được thiết kế chuẩn hóa mức Table gồm **12 bảng**:

| STT | Tên bảng | Khóa chính (PK) | Khóa ngoại (FK) | Mô tả chức năng |
|:---:|:---|:---|:---|:---|
| 1 | `users` | `id` | Không | Quản lý tài khoản (Khách hàng, Admin, Nhân viên) |
| 2 | `categories` | `id` | Không | Phân loại danh mục món ăn (Bánh tráng, Đồ chiên...) |
| 3 | `products` | `id` | `category_id` | Danh sách món ăn, giá bán, tồn kho, cấp độ cay, ảnh |
| 4 | `vouchers` | `id` | Không | Quản lý mã giảm giá, hạn sử dụng, điều kiện áp dụng |
| 5 | `orders` | `id` | `user_id` | Thông tin đơn đặt hàng, giao nhận, thanh toán, tổng tiền |
| 6 | `order_items` | `id` | `order_id`, `product_id` | Chi tiết món ăn, đơn giá lúc mua, cấp độ cay từng món |
| 7 | `reviews` | `id` | `product_id`, `user_id` | Đánh giá, chấm sao (1-5 sao), mức cay đã trải nghiệm |
| 8 | `review_replies` | `id` | `review_id` | Phản hồi của cửa hàng/admin đối với đánh giá của khách |
| 9 | `shipping_addresses` | `id` | `user_id` | Sổ lưu địa chỉ nhận hàng của người dùng |
| 10 | `inventory_logs` | `id` | `product_id` | Nhật ký nhập - xuất - kiểm kê tồn kho nguyên liệu món |
| 11 | `customer_ranks` | `rank_id` | Không | Cấu hình cấp bậc thành viên (Đồng, Bạc, Vàng, Kim Cương) |
| 12 | `audit_logs` | `id` | Không | Nhật ký an ninh hệ thống và lịch sử thao tác của Admin |

### Quan hệ chính giữa các bảng:
* `categories` (1) ─── (N) `products`
* `users` (1) ─── (N) `orders`
* `orders` (1) ─── (N) `order_items`
* `products` (1) ─── (N) `order_items`
* `products` (1) ─── (N) `reviews`
* `reviews` (1) ─── (N) `review_replies`
* `users` (1) ─── (N) `shipping_addresses`
* `products` (1) ─── (N) `inventory_logs`
* `vouchers` (1) ─── (N) `orders`
