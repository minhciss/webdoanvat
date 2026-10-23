import { products, categories } from '../data/mockStore.js';

export const getProducts = (req, res) => {
  const { category, search, sort } = req.query;
  let result = [...products];

  if (category && category !== 'all') {
    result = result.filter((p) => p.categoryId === category);
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  if (sort === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'popular') {
    result.sort((a, b) => b.soldCount - a.soldCount);
  }

  return res.json({ success: true, count: result.length, data: result });
};

export const getProductById = (req, res) => {
  const { id } = req.params;
  const product = products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
  }
  return res.json({ success: true, data: product });
};

export const getCategories = (req, res) => {
  return res.json({ success: true, data: categories });
};

export const createProduct = (req, res) => {
  const newProduct = {
    id: `PROD-${Date.now().toString().slice(-4)}`,
    ...req.body,
    rating: 5.0,
    reviewCount: 0,
    soldCount: 0,
    status: req.body.status || 'available',
  };
  products.unshift(newProduct);
  return res.status(201).json({ success: true, message: 'Thêm sản phẩm thành công', data: newProduct });
};

export const updateProduct = (req, res) => {
  const { id } = req.params;
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
  }
  products[index] = { ...products[index], ...req.body };
  return res.json({ success: true, message: 'Cập nhật thành công', data: products[index] });
};

export const deleteProduct = (req, res) => {
  const { id } = req.params;
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
  }
  const deleted = products.splice(index, 1);
  return res.json({ success: true, message: 'Xóa sản phẩm thành công', data: deleted[0] });
};
