# SƠ ĐỒ THỰC THỂ QUAN HỆ (ERD) - WEBSITE ĐỒ ĂN VẶT

Tài liệu thiết kế cơ sở dữ liệu cho môn học Công nghệ phần mềm: Hệ thống Website Đặt Đồ Ăn Vặt Trực Tuyến (**ĂnVặtPro**).

## 1. Sơ đồ Mermaid ERD (12 Bảng Chuẩn Hóa)

```mermaid
erDiagram
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ SHIPPING_ADDRESSES : "saves"
    CATEGORIES ||--o{ PRODUCTS : "contains"
    PRODUCTS ||--o{ ORDER_ITEMS : "included_in"
    PRODUCTS ||--o{ REVIEWS : "receives"
    PRODUCTS ||--o{ INVENTORY_LOGS : "logs"
    ORDERS ||--|{ ORDER_ITEMS : "has"
    VOUCHERS ||--o{ ORDERS : "applied_to"
    REVIEWS ||--o{ REVIEW_REPLIES : "replied_by"

    USERS {
        string id PK "Mã người dùng (USR-xxx)"
        string full_name "Họ và tên"
        string email UK "Email đăng nhập"
        string phone "Số điện thoại"
        string password_hash "Mật khẩu mã hóa"
        string role "customer | admin | staff"
        string address "Địa chỉ mặc định"
        int loyalty_points "Điểm tích lũy"
        string avatar_url "Ảnh đại diện"
        boolean is_active "Trạng thái hoạt động"
        timestamp created_at "Ngày tạo"
        timestamp updated_at "Ngày cập nhật"
    }

    CATEGORIES {
        string id PK "Mã danh mục (banh-trang, do-chien...)"
        string name "Tên danh mục"
        string slug UK "Đường dẫn thân thiện"
        string icon "Tên biểu tượng Lucide"
        string description "Mô tả danh mục"
        int display_order "Thứ tự sắp xếp"
        boolean is_active "Hiển thị menu"
        timestamp created_at "Ngày tạo"
    }

    PRODUCTS {
        string id PK "Mã món ăn (BT-01, DC-01...)"
        string category_id FK "Thuộc danh mục"
        string name "Tên món ăn"
        decimal price "Giá bán hiện tại"
        decimal original_price "Giá gốc chưa giảm"
        int discount_percent "% Giảm giá"
        decimal rating "Điểm đánh giá trung bình"
        int review_count "Số lượt nhận xét"
        int sold_count "Lượng đã bán"
        int stock "Số lượng tồn kho"
        string default_spice "Độ cay mặc định"
        text spice_levels "Danh sách cấp độ cay"
        string image_url "Đường dẫn ảnh món"
        text description "Mô tả chi tiết"
        text ingredients "Thành phần nguyên liệu"
        boolean is_flash_sale "Đang Flash Sale"
        boolean is_best_seller "Món bán chạy"
        boolean is_new "Món mới ra mắt"
        string status "available | out_of_stock | inactive"
        timestamp created_at "Ngày tạo"
        timestamp updated_at "Ngày sửa"
    }

    VOUCHERS {
        string id PK "Mã voucher"
        string code UK "Mã code áp dụng (ANVAT20...)"
        decimal discount_amount "Số tiền giảm"
        string discount_type "fixed | percent"
        decimal min_order_amount "Giá trị đơn tối thiểu"
        date expiry_date "Hạn dùng"
        int usage_limit "Giới hạn số lần"
        int used_count "Số lần đã áp dụng"
        text description "Điều kiện áp dụng"
        boolean is_active "Đang hoạt động"
        timestamp created_at "Ngày tạo"
    }

    ORDERS {
        string id PK "Mã đơn hàng (AV-xxxxx)"
        string user_id FK "Người đặt (nullable nếu mua nhanh)"
        string customer_name "Tên khách nhận"
        string customer_phone "SĐT liên hệ"
        text shipping_address "Địa chỉ giao hàng"
        timestamp order_date "Thời gian đặt"
        string status "pending | confirmed | shipping | completed | cancelled"
        string payment_method "cod | vietqr | momo | vnpay"
        string payment_status "unpaid | paid"
        decimal shipping_fee "Phí vận chuyển"
        decimal discount_amount "Tiền giảm từ voucher"
        string voucher_code "Mã giảm giá đã dùng"
        decimal total_amount "Tổng thanh toán"
        text note "Ghi chú cho quán/shipper"
        timestamp created_at "Ngày tạo"
        timestamp updated_at "Ngày cập nhật"
    }

    ORDER_ITEMS {
        int id PK "Khóa chính tự tăng"
        string order_id FK "Thuộc đơn hàng nào"
        string product_id FK "Mã món ăn"
        string product_name "Tên món lúc mua"
        decimal price "Đơn giá lúc mua"
        int quantity "Số lượng mua"
        string spice_level "Cấp độ cay khách chọn"
        decimal subtotal "Thành tiền"
    }

    REVIEWS {
        int id PK "Khóa chính tự tăng"
        string product_id FK "Món ăn được đánh giá"
        string user_id FK "Người đánh giá"
        string user_name "Tên hiển thị"
        int rating "Số sao (1 - 5)"
        text comment "Nội dung nhận xét"
        string spice_level "Cấp độ cay đã trải nghiệm"
        timestamp created_at "Thời điểm đánh giá"
    }

    REVIEW_REPLIES {
        int id PK "Khóa chính tự tăng"
        int review_id FK "Thuộc đánh giá nào"
        string admin_id "Mã quản trị viên phản hồi"
        string admin_name "Tên nhân viên/quản lý"
        text reply_text "Nội dung phản hồi"
        timestamp created_at "Thời gian phản hồi"
    }

    SHIPPING_ADDRESSES {
        int id PK "Khóa chính tự tăng"
        string user_id FK "Thuộc tài khoản người dùng"
        string recipient_name "Tên người nhận"
        string phone "Số điện thoại"
        string address "Địa chỉ cụ thể (số nhà, đường)"
        string ward "Phường/Xã"
        string district "Quận/Huyện"
        string province "Tỉnh/Thành phố"
        boolean is_default "Địa chỉ giao hàng mặc định"
        timestamp created_at "Thời điểm tạo"
    }

    INVENTORY_LOGS {
        int id PK "Khóa chính tự tăng"
        string product_id FK "Món ăn/Nguyên liệu"
        string change_type "IMPORT | EXPORT_ORDER | ADJUSTMENT | SPOILED"
        int quantity_change "Biến động (+ / -)"
        int remaining_stock "Số lượng tồn sau biến động"
        string note "Lý do nhập/xuất/điều chỉnh"
        string created_by "Người thực hiện"
        timestamp created_at "Thời điểm giao dịch kho"
    }

    CUSTOMER_RANKS {
        string rank_id PK "Mã hạng (BRONZE, SILVER, GOLD, DIAMOND)"
        string rank_name "Tên hạng thành viên"
        decimal min_spent "Hạn mức chi tiêu tối thiểu"
        decimal discount_percentage "% Giảm giá độc quyền"
        text perks_description "Quyền lợi VIP"
        string badge_color "Màu sắc huy hiệu"
    }

    AUDIT_LOGS {
        int id PK "Khóa chính tự tăng"
        string user_email "Email người thao tác"
        string action "Hành động (Duyệt đơn, Đổi giá...)"
        text detail "Chi tiết thay đổi"
        string ip_address "Địa chỉ IP"
        timestamp created_at "Thời điểm ghi nhận"
    }
```

## 2. Bảng tổng hợp quan hệ (Relationships)

| Bảng nguồn | Quan hệ | Bảng đích | Mô tả |
| :--- | :---: | :--- | :--- |
| `categories` | 1 - N | `products` | Một danh mục chứa nhiều sản phẩm món ăn vặt |
| `users` | 1 - N | `orders` | Một khách hàng có thể đặt nhiều đơn hàng |
| `orders` | 1 - N | `order_items` | Một đơn hàng bao gồm một hoặc nhiều món chi tiết |
| `products` | 1 - N | `order_items` | Một món ăn có thể xuất hiện trong nhiều chi tiết đơn hàng |
| `products` | 1 - N | `reviews` | Một món ăn nhận được nhiều lượt đánh giá từ khách |
| `users` | 1 - N | `reviews` | Một người dùng có thể gửi đánh giá cho sản phẩm |
| `reviews` | 1 - N | `review_replies` | Một đánh giá có thể được Admin/Chủ quán phản hồi giải đáp |
| `users` | 1 - N | `shipping_addresses` | Một người dùng có thể lưu nhiều địa chỉ nhận hàng trong sổ địa chỉ |
| `products` | 1 - N | `inventory_logs` | Mỗi sản phẩm có lịch sử ghi vết xuất/nhập/tồn kho chi tiết |
| `vouchers` | 1 - N | `orders` | Một mã voucher có thể được áp dụng cho nhiều đơn hàng hợp lệ |
