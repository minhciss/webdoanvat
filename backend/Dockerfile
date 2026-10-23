# ==========================================
# DOCKERFILE CHO BACKEND ĂNVẶTPRO (EXPRESS.JS)
# ==========================================

# 1. Base image Node.js LTS bản Alpine siêu nhẹ và tối ưu
FROM node:20-alpine

# 2. Thư mục làm việc trong container
WORKDIR /app

# 3. Copy file định nghĩa gói phụ thuộc trước để tận dụng Docker cache
COPY package*.json ./

# 4. Cài đặt các thư viện sản xuất
RUN npm install --omit=dev

# 5. Copy toàn bộ mã nguồn backend
COPY . .

# 6. Khai báo cổng 5000 mà server Express lắng nghe
EXPOSE 5000

# 7. Khai báo biến môi trường mặc định
ENV NODE_ENV=production
ENV PORT=5000

# 8. Lệnh khởi chạy server khi container chạy
CMD ["node", "src/server.js"]
