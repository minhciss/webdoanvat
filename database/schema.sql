-- ==============================================================================
-- DATABASE SCHEMA: ĂNVẶTPRO E-COMMERCE SYSTEM
-- Dự án: Hệ thống Website Đặt Đồ Ăn Vặt Trực Tuyến (Công nghệ Phần mềm)
-- Tương thích: MySQL 8.0+ / MariaDB 10.5+ / PostgreSQL (điều chỉnh nhẹ kiểu dữ liệu)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `webdoanvat` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `webdoanvat`;

-- 1. BẢNG NGƯỜI DÙNG (USERS)
CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `phone` VARCHAR(20) NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('customer', 'admin', 'staff') DEFAULT 'customer',
    `address` TEXT NULL,
    `loyalty_points` INT DEFAULT 0,
    `avatar_url` VARCHAR(500) NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. BẢNG DANH MỤC SẢN PHẨM (CATEGORIES)
CREATE TABLE IF NOT EXISTS `categories` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL UNIQUE,
    `icon` VARCHAR(50) NULL,
    `description` TEXT NULL,
    `display_order` INT DEFAULT 0,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. BẢNG SẢN PHẨM ĐỒ ĂN VẶT (PRODUCTS)
CREATE TABLE IF NOT EXISTS `products` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `category_id` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `original_price` DECIMAL(12, 2) NOT NULL,
    `discount_percent` INT DEFAULT 0,
    `rating` DECIMAL(2, 1) DEFAULT 5.0,
    `review_count` INT DEFAULT 0,
    `sold_count` INT DEFAULT 0,
    `stock` INT DEFAULT 0,
    `default_spice` VARCHAR(50) DEFAULT 'Cay vừa',
    `spice_levels` TEXT NULL COMMENT 'JSON string danh sách độ cay',
    `image_url` VARCHAR(1000) NULL,
    `description` TEXT NULL,
    `ingredients` TEXT NULL,
    `is_flash_sale` BOOLEAN DEFAULT FALSE,
    `is_best_seller` BOOLEAN DEFAULT FALSE,
    `is_new` BOOLEAN DEFAULT FALSE,
    `status` ENUM('available', 'out_of_stock', 'inactive') DEFAULT 'available',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_products_categories` 
        FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) 
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX `idx_products_category` (`category_id`),
    INDEX `idx_products_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BẢNG MÃ KHUYẾN MÃI / VOUCHER (VOUCHERS)
CREATE TABLE IF NOT EXISTS `vouchers` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL UNIQUE,
    `discount_amount` DECIMAL(12, 2) NOT NULL,
    `discount_type` ENUM('fixed', 'percent') DEFAULT 'fixed',
    `min_order_amount` DECIMAL(12, 2) DEFAULT 0,
    `expiry_date` DATE NOT NULL,
    `usage_limit` INT DEFAULT 100,
    `used_count` INT DEFAULT 0,
    `description` TEXT NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_vouchers_code` (`code`),
    INDEX `idx_vouchers_active` (`is_active`, `expiry_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. BẢNG ĐƠN HÀNG (ORDERS)
CREATE TABLE IF NOT EXISTS `orders` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `user_id` VARCHAR(50) NULL,
    `customer_name` VARCHAR(100) NOT NULL,
    `customer_phone` VARCHAR(20) NOT NULL,
    `shipping_address` TEXT NOT NULL,
    `order_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `status` ENUM('pending', 'confirmed', 'shipping', 'completed', 'cancelled') DEFAULT 'pending',
    `payment_method` ENUM('cod', 'vietqr', 'momo', 'vnpay') DEFAULT 'cod',
    `payment_status` ENUM('unpaid', 'paid') DEFAULT 'unpaid',
    `shipping_fee` DECIMAL(12, 2) DEFAULT 0,
    `discount_amount` DECIMAL(12, 2) DEFAULT 0,
    `voucher_code` VARCHAR(50) NULL,
    `total_amount` DECIMAL(12, 2) NOT NULL,
    `note` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_orders_users` 
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) 
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX `idx_orders_status` (`status`),
    INDEX `idx_orders_user` (`user_id`),
    INDEX `idx_orders_date` (`order_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. BẢNG CHI TIẾT ĐƠN HÀNG (ORDER_ITEMS)
CREATE TABLE IF NOT EXISTS `order_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` VARCHAR(50) NOT NULL,
    `product_id` VARCHAR(50) NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `quantity` INT NOT NULL,
    `spice_level` VARCHAR(50) DEFAULT 'Cay vừa',
    `subtotal` DECIMAL(12, 2) NOT NULL,
    CONSTRAINT `fk_order_items_orders` 
        FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_order_items_products` 
        FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) 
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX `idx_order_items_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. BẢNG ĐÁNH GIÁ SẢN PHẨM (REVIEWS)
CREATE TABLE IF NOT EXISTS `reviews` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_id` VARCHAR(50) NOT NULL,
    `user_id` VARCHAR(50) NULL,
    `user_name` VARCHAR(100) NOT NULL,
    `rating` INT NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
    `comment` TEXT NOT NULL,
    `spice_level` VARCHAR(50) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_reviews_products` 
        FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_reviews_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. BẢNG NHẬT KÝ HỆ THỐNG (AUDIT_LOGS)
CREATE TABLE IF NOT EXISTS `audit_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_email` VARCHAR(100) NOT NULL,
    `action` VARCHAR(100) NOT NULL,
    `detail` TEXT NOT NULL,
    `ip_address` VARCHAR(45) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_audit_logs_time` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 9. BẢNG PHẢN HỒI ĐÁNH GIÁ (REVIEW_REPLIES)
CREATE TABLE IF NOT EXISTS `review_replies` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `review_id` INT NOT NULL,
    `admin_id` VARCHAR(50) NOT NULL,
    `admin_name` VARCHAR(100) NOT NULL,
    `reply_text` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_replies_review` 
        FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_replies_review` (`review_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. BẢNG SỔ ĐỊA CHỈ KHÁCH HÀNG (SHIPPING_ADDRESSES)
CREATE TABLE IF NOT EXISTS `shipping_addresses` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` VARCHAR(50) NOT NULL,
    `recipient_name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `ward` VARCHAR(100) NULL,
    `district` VARCHAR(100) NULL,
    `province` VARCHAR(100) DEFAULT 'TP. Hồ Chí Minh',
    `is_default` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_addresses_users` 
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_addresses_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. BẢNG NHẬT KÝ NHẬP XUẤT KHO (INVENTORY_LOGS)
CREATE TABLE IF NOT EXISTS `inventory_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_id` VARCHAR(50) NOT NULL,
    `change_type` ENUM('IMPORT', 'EXPORT_ORDER', 'ADJUSTMENT', 'SPOILED') NOT NULL,
    `quantity_change` INT NOT NULL,
    `remaining_stock` INT NOT NULL,
    `note` VARCHAR(255) NULL,
    `created_by` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_inventory_products` 
        FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX `idx_inventory_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. BẢNG CẤU HÌNH HẠNG THÀNH VIÊN (CUSTOMER_RANKS)
CREATE TABLE IF NOT EXISTS `customer_ranks` (
    `rank_id` VARCHAR(20) PRIMARY KEY,
    `rank_name` VARCHAR(50) NOT NULL,
    `min_spent` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `discount_percentage` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `perks_description` TEXT NULL,
    `badge_color` VARCHAR(20) DEFAULT '#gray'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
