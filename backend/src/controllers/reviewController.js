import { reviews } from '../data/mockStore.js';

export const getReviews = (req, res) => {
  const { productId } = req.query;
  let result = reviews;
  if (productId) {
    result = reviews.filter((r) => r.productId === productId);
  }
  return res.json({ success: true, count: result.length, data: result });
};

export const createReview = (req, res) => {
  const { productId, userName, rating, comment, spiceLevel } = req.body;
  if (!productId || !userName || !rating || !comment) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền đủ thông tin đánh giá' });
  }

  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

  const newReview = {
    id: reviews.length + 1,
    productId,
    userName,
    rating: Number(rating),
    comment,
    spiceLevel: spiceLevel || 'Cay vừa',
    date: dateStr,
  };

  reviews.unshift(newReview);
  return res.status(201).json({ success: true, message: 'Gửi đánh giá thành công', data: newReview });
};
