-- ==============================================================================
-- DATABASE SEED DATA: ĂNVẶTPRO E-COMMERCE SYSTEM
-- Dữ liệu mẫu khởi tạo đầy đủ cho đồ án Công nghệ Phần mềm
-- ==============================================================================

USE `webdoanvat`;

-- Xóa dữ liệu cũ theo thứ tự ràng buộc khóa ngoại
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `audit_logs`;
TRUNCATE TABLE `reviews`;
TRUNCATE TABLE `order_items`;
TRUNCATE TABLE `orders`;
TRUNCATE TABLE `vouchers`;
TRUNCATE TABLE `products`;
TRUNCATE TABLE `categories`;
TRUNCATE TABLE `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. SEED DỮ LIỆU NGƯỜI DÙNG
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password_hash`, `role`, `address`, `loyalty_points`) VALUES
('USR-ADMIN', 'Quản Trị Viên', 'admin@anvatpro.vn', '0901234567', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'admin', 'Văn phòng ĂnVặtPro, Quận 1, TP.HCM', 1000),
('USR-01', 'Nguyễn Văn An', 'khachhang@anvatpro.vn', '0909123456', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'customer', '72 Lê Thánh Tôn, Bến Nghé, Quận 1, TP.HCM', 240),
('USR-02', 'Nguyễn Thu Trang', 'thutrang@gmail.com', '0912345678', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'customer', 'Tòa Landmark 81, P.22, Bình Thạnh, TP.HCM', 150),
('USR-03', 'Trần Văn Hoàng', 'hoangtran@gmail.com', '0988776655', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'customer', '45 Lê Duẩn, P. Bến Nghé, Quận 1, TP.HCM', 320);

-- 2. SEED DANH MỤC
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `display_order`, `is_active`) VALUES
('banh-trang', 'Bánh tráng', 'banh-trang', 'Flame', 'Các loại bánh tráng cuộn, trộn sa tế, phơi sương nướng sốt trứng muối', 1, TRUE),
('do-chien', 'Đồ chiên giòn', 'do-chien', 'Utensils', 'Cá viên chiên mắm tóp mỡ, nem chua rán, khoai tây lắc phô mai', 2, TRUE),
('an-vat-cay', 'Ăn vặt cay tê', 'an-vat-cay', 'Soup', 'Chân gà rút xương sốt Thái cay nồng, khô bò lá chanh cháy tỏi', 3, TRUE),
('che-trang-mieng', 'Chè & Tráng miệng', 'che-trang-mieng', 'IceCream', 'Chè khúc bạch thanh mát, tàu hũ trân châu cốt dừa', 4, TRUE),
('tra-sua-nuoc', 'Trà sữa & Nước', 'tra-sua-nuoc', 'Coffee', 'Trà mãng cầu nhiệt đới, trà sữa hoàng kim giải khát đã khát', 5, TRUE),
('combo', 'Combo cày phim', 'combo', 'PackageCheck', 'Set tiết kiệm kết hợp nhiều món siêu hời cho nhóm bạn', 6, TRUE);

-- 3. SEED SẢN PHẨM
INSERT INTO `products` (`id`, `category_id`, `name`, `price`, `original_price`, `discount_percent`, `rating`, `review_count`, `sold_count`, `stock`, `default_spice`, `spice_levels`, `image_url`, `description`, `ingredients`, `is_flash_sale`, `is_best_seller`, `is_new`, `status`) VALUES
('BT-01', 'banh-trang', 'Bánh Tráng Cuốn Sốt Bơ Trứng Muối', 32000, 40000, 20, 4.9, 142, 1250, 45, 'Cay vừa', '["Không cay", "Cay nhẹ", "Cay vừa", "Cay tê tái"]', 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop&q=80', 'Bánh tráng dẻo Tây Ninh cuộn đẫm nhân ruốc tôm hành phi giòn tan, phủ đẫm sốt bơ trứng muối béo ngậy độc quyền ĂnVặtPro.', 'Bánh tráng dẻo, sốt bơ vàng béo, sốt trứng muối sệt, hành phi giòn, khô bò, ruốc tôm, trứng cút lòng đào.', TRUE, TRUE, FALSE, 'available'),
('BT-02', 'banh-trang', 'Bánh Tráng Trộn Sa Tế Khô Bò Cháy Tỏi', 28000, 35000, 20, 4.8, 98, 940, 3, 'Cay vừa', '["Cay nhẹ", "Cay vừa", "Cay tê tái"]', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80', 'Bánh tráng trộn sợi dẻo thấm đẫm sa tế tôm cay nồng, topping ngập tràn khô bò đen, mực sợi, lạc rang và rau răm thơm nức.', 'Bánh tráng sợi dẻo, sa tế ớt hiểm, muối tôm loại 1, khô bò cay, trứng cút luộc, xoài xanh bào sợi.', FALSE, TRUE, FALSE, 'available'),
('BT-03', 'banh-trang', 'Bánh Tráng Phơi Sương Chấm Sốt Me Bơ', 35000, 35000, 0, 4.9, 65, 780, 60, 'Cay nhẹ', '["Không cay", "Cay nhẹ", "Cay vừa"]', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80', 'Đặc sản phơi sương Trảng Bàng siêu mềm dẻo, set bao gồm sốt me chua cay sánh mịn hòa quyện bơ béo và muối tôm hột.', 'Bánh tráng phơi sương 10 miếng, hũ sốt me chua ngọt cay, bơ béo thơm, muối tôm Tây Ninh, hành tỏi phi.', FALSE, FALSE, TRUE, 'available'),
('DC-01', 'do-chien', 'Cá Viên Chiên Mắm Tỏi Ớt Thập Cẩm (Set Lớn)', 65000, 75000, 13, 4.9, 184, 1890, 25, 'Cay vừa', '["Không cay", "Cay nhẹ", "Cay vừa", "Cay tê tái"]', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80', 'Mẹt cá viên chiên mắm thơm lừng xèo xèo gồm cá viên, bò viên, tôm viên, chả cá cốm, đậu bắp xào và tóp mỡ giòn rụm.', 'Cá viên, bò viên, chả tôm cốm, xúc xích, đậu bắp non, tỏi cô đơn phi giòn, tóp mỡ da giòn rụm, nước mắm nhĩ.', TRUE, TRUE, FALSE, 'available'),
('DC-02', 'do-chien', 'Khoai Tây Lắc Phô Mai Lốc Xoáy Khổng Lồ', 30000, 35000, 14, 4.7, 72, 850, 40, 'Không cay', '["Không cay", "Cay nhẹ"]', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80', 'Khoai tây cắt que nhập khẩu giòn rụm bên ngoài bở mềm bên trong, lắc đều bột phô mai Tornado béo ngọt mặn mà.', 'Khoai tây Bỉ cao cấp, bột phô mai truyền thống, muối tỏi thảo mộc, dầu thực vật cao cấp chiên mới mỗi ngày.', FALSE, FALSE, FALSE, 'available'),
('AV-01', 'an-vat-cay', 'Chân Gà Rút Xương Sốt Thái Chua Cay Tê Tái', 69000, 85000, 19, 4.9, 210, 2100, 15, 'Cay tê tái', '["Cay vừa", "Cay tê tái"]', 'https://images.unsplash.com/photo-1527477378734-75eb994514ba?w=600&auto=format&fit=crop&q=80', 'Chân gà tươi rút xương giòn sần sật ngâm đẫm sốt Thái cay xé lưỡi, quyện lẫn vị chua dịu của cóc bao tử và sả thơm ngào ngạt.', 'Chân gà tươi CP rút xương, cóc non chua ngọt, xoài non, ớt chỉ thiên, sả bào, quất tươi, nước cốt sốt Thái công thức riêng.', TRUE, TRUE, FALSE, 'available'),
('TS-01', 'tra-sua-nuoc', 'Trà Mãng Cầu Đậm Vị Nhiệt Đới (Size L)', 35000, 35000, 0, 4.8, 88, 1120, 50, 'Không cay', '["Không cay"]', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80', 'Trà ô long thơm ngát kết hợp cùng múi mãng cầu xiêm tươi ngọt thanh chua nhẹ, giải ngấy tức thì khi ăn đồ cay chiên.', 'Trà Ô Long Lộc Phát, mãng cầu xiêm Đắk Lắk ướp đường phèn, đường mía thanh khiết, thạch nha đam giòn.', FALSE, TRUE, FALSE, 'available'),
('CB-01', 'combo', 'Combo Cày Phim Cuối Tuần (Dành cho 2 - 3 người)', 135000, 165000, 18, 5.0, 156, 1420, 18, 'Cay vừa', '["Không cay", "Cay nhẹ", "Cay vừa", "Cay tê tái"]', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80', 'Set đại tiệc đầy ắp gồm: 1 Bánh tráng cuộn bơ + 1 Mẹt cá viên mắm tỏi + 1 Chân gà sốt Thái + 2 Ly Trà mãng cầu mát lạnh.', 'Trọn bộ 4 món best seller được yêu thích nhất quán, đóng hộp giữ nhiệt kèm đầy đủ đũa thìa và bao tay nilon.', TRUE, TRUE, FALSE, 'available');

-- 4. SEED VOUCHERS
INSERT INTO `vouchers` (`id`, `code`, `discount_amount`, `discount_type`, `min_order_amount`, `expiry_date`, `usage_limit`, `used_count`, `description`, `is_active`) VALUES
('VOUCHER-01', 'ANVAT20', 20000, 'fixed', 100000, '2026-12-31', 500, 128, 'Giảm ngay 20.000đ cho đơn hàng đồ ăn vặt từ 100.000đ', TRUE),
('VOUCHER-02', 'ANVAT50', 50000, 'fixed', 250000, '2026-12-31', 200, 45, 'Giảm siêu khủng 50.000đ cho đơn tiệc đông người từ 250.000đ', TRUE),
('VOUCHER-03', 'BANHTRANG15', 15000, 'fixed', 80000, '2026-11-30', 300, 89, 'Giảm 15.000đ cho tín đồ đam mê mọi thể loại bánh tráng', TRUE),
('VOUCHER-04', 'FREESHIP', 20000, 'fixed', 120000, '2026-12-31', 1000, 312, 'Hỗ trợ miễn phí vận chuyển tối đa 20.000đ cho đơn từ 120.000đ', TRUE),
('VOUCHER-05', 'CHAOBANMOI', 25000, 'fixed', 50000, '2026-12-31', 200, 67, 'Giảm 25.000đ cho khách hàng đặt đơn đầu tiên', TRUE);

-- 5. SEED ĐƠN HÀNG
INSERT INTO `orders` (`id`, `user_id`, `customer_name`, `customer_phone`, `shipping_address`, `order_date`, `status`, `payment_method`, `payment_status`, `shipping_fee`, `discount_amount`, `voucher_code`, `total_amount`, `note`) VALUES
('AV-89211', 'USR-02', 'Nguyễn Thu Trang', '0912345678', 'Tòa Landmark 81, P.22, Bình Thạnh, TP.HCM', '2026-10-23 16:20:00', 'pending', 'vietqr', 'paid', 20000, 25000, 'CHAOBANMOI', 147000, 'Bánh tráng cuốn cho nhiều sốt bơ nhé quán ơi, cay vừa thôi ạ!'),
('AV-77420', 'USR-03', 'Trần Văn Hoàng', '0988776655', '45 Lê Duẩn, P. Bến Nghé, Quận 1, TP.HCM', '2026-10-23 15:45:00', 'confirmed', 'momo', 'paid', 20000, 50000, 'ANVAT50', 205000, 'Giao giờ hành chính, gọi trước 5 phút giúp em.'),
('AV-65103', NULL, 'Lê Minh Anh', '0903112233', '123 Sư Vạn Hạnh, P.12, Quận 10, TP.HCM', '2026-10-23 14:15:00', 'shipping', 'cod', 'unpaid', 15000, 0, NULL, 110000, 'Đem theo tiền thừa 500k giúp mình nhé shipper.'),
('AV-51299', NULL, 'Hoàng Thị Thảo', '0934556677', '88 Nguyễn Đình Chiểu, Đa Kao, Quận 1, TP.HCM', '2026-10-22 19:30:00', 'completed', 'vietqr', 'paid', 20000, 35000, 'BANHTRANG15', 185000, 'Đã nhận đồ ăn nóng giòn rất ưng ý!'),
('AV-41002', NULL, 'Phạm Đức Dũng', '0977889900', 'Kí túc xá Khu B ĐHQG TP.HCM, Dĩ An, Bình Dương', '2026-10-21 11:10:00', 'cancelled', 'cod', 'unpaid', 30000, 0, NULL, 95000, 'Khách đổi ý đi ăn cơm trưa cùng bạn nên hủy đơn.');

-- 6. SEED CHI TIẾT ĐƠN HÀNG
INSERT INTO `order_items` (`order_id`, `product_id`, `product_name`, `price`, `quantity`, `spice_level`, `subtotal`) VALUES
('AV-89211', 'BT-01', 'Bánh Tráng Cuốn Sốt Bơ Trứng Muối', 32000, 2, 'Cay vừa', 64000),
('AV-89211', 'AV-01', 'Chân Gà Rút Xương Sốt Thái Chua Cay Tê Tái', 69000, 1, 'Cay vừa', 69000),
('AV-89211', 'TS-01', 'Trà Mãng Cầu Đậm Vị Nhiệt Đới (Size L)', 35000, 1, 'Không cay', 35000),
('AV-77420', 'CB-01', 'Combo Cày Phim Cuối Tuần (Dành cho 2 - 3 người)', 135000, 1, 'Cay vừa', 135000),
('AV-77420', 'DC-01', 'Cá Viên Chiên Mắm Tỏi Ớt Thập Cẩm (Set Lớn)', 65000, 1, 'Cay tê tái', 65000),
('AV-65103', 'BT-02', 'Bánh Tráng Trộn Sa Tế Khô Bò Cháy Tỏi', 28000, 2, 'Cay tê tái', 56000),
('AV-65103', 'DC-02', 'Khoai Tây Lắc Phô Mai Lốc Xoáy Khổng Lồ', 30000, 1, 'Không cay', 30000);

-- 7. SEED ĐÁNH GIÁ (REVIEWS)
INSERT INTO `reviews` (`product_id`, `user_id`, `user_name`, `rating`, `comment`, `spice_level`, `created_at`) VALUES
('BT-01', 'USR-02', 'Thanh Thảo', 5, 'Bánh tráng cuốn bơ siêu béo ngậy, sốt trứng muối mặn ngọt vừa vặn lắm luôn. Giao tới vẫn còn dẻo quẹo 10/10!', 'Cay vừa', '2026-10-23 16:40:00'),
('AV-01', 'USR-03', 'Minh Quang', 5, 'Chân gà rút xương sạch sẽ, nước sốt Thái chua ngọt cay tê đúng gu mình. Cóc non giòn tan ăn không bị ngấy.', 'Cay tê tái', '2026-10-22 17:15:00'),
('DC-01', 'USR-01', 'Bảo Ngọc', 5, 'Set cá viên chiên mắm thơm nức mũi cả phòng trọ luôn á. Tóp mỡ giòn rụm với đậu bắp xào mắm xuất sắc!', 'Cay vừa', '2026-10-21 20:10:00');

-- 8. SEED NHẬT KÝ HỆ THỐNG (AUDIT LOGS)
INSERT INTO `audit_logs` (`user_email`, `action`, `detail`, `created_at`) VALUES
('admin@anvatpro.vn', 'Duyệt đơn hàng', 'Chuyển đơn AV-77420 sang trạng thái Confirmed (Đã duyệt)', '2026-10-23 16:30:00'),
('admin@anvatpro.vn', 'Cập nhật sản phẩm', 'Sửa giá khuyến mãi Bánh tráng cuốn bơ trứng muối từ 35.000đ xuống 32.000đ', '2026-10-23 15:10:00'),
('stock@anvatpro.vn', 'Nhập kho nguyên liệu', 'Nhập 50kg Bánh tráng phơi sương từ NCC Tây Ninh', '2026-10-23 14:00:00'),
('admin@anvatpro.vn', 'Phát hành Voucher', 'Tạo mã mới CHAOBANMOI giảm 25.000đ', '2026-10-23 11:20:00');
