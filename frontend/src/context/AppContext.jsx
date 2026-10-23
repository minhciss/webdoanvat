import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PRODUCTS,
  AVAILABLE_VOUCHERS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation / View modes
  const [viewMode, setViewMode] = useState('customer'); // 'customer' | 'admin'
  const [customerTab, setCustomerTab] = useState('home'); // 'home' | 'menu' | 'cart' | 'checkout' | 'tracking' | 'profile'
  const [adminTab, setAdminTab] = useState('dashboard'); // 'dashboard' | 'products' | 'orders' | 'inventory' | 'vouchers' | 'reviews' | 'logs'

  // Products
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('anvat_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Cart
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('anvat_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Vouchers
  const [vouchers, setVouchers] = useState(AVAILABLE_VOUCHERS);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');

  // Orders
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('anvat_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [activeTrackingId, setActiveTrackingId] = useState('AV-89211');

  // Reviews
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // User Authentication
  const [user, setUser] = useState({
    id: 'USR-01',
    name: 'Nguyễn Văn An',
    email: 'khachhang@anvatpro.vn',
    phone: '0909123456',
    address: '72 Lê Thánh Tôn, Bến Nghé, Quận 1, TP.HCM',
    points: 240, // 240 điểm tích lũy
    role: 'customer', // 'customer' | 'admin'
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Product Detail Modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Mini Cart Drawer
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Sync products and cart to localStorage
  useEffect(() => {
    localStorage.setItem('anvat_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('anvat_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('anvat_orders', JSON.stringify(orders));
  }, [orders]);

  // Cart Operations
  const addToCart = (product, spiceLevel = 'Cay vừa', quantity = 1) => {
    if (product.stock <= 0) {
      showToast('Sản phẩm đã hết hàng trong kho!', 'error');
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.spiceLevel === spiceLevel
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > product.stock) {
          showToast(`Chỉ còn ${product.stock} phần trong kho!`, 'error');
          return prevCart;
        }
        updated[existingIndex].quantity = newQty;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId: `${product.id}-${spiceLevel}-${Date.now()}`,
            product,
            spiceLevel,
            quantity: Math.min(quantity, product.stock),
          },
        ];
      }
    });

    showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const updateCartQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.cartItemId === cartItemId) {
          if (newQuantity > item.product.stock) {
            showToast(`Số lượng tồn chỉ còn ${item.product.stock}!`, 'error');
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('Đã xóa món khỏi giỏ hàng!', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedVoucher(null);
  };

  // Calculations
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const calculateDiscount = () => {
    if (!appliedVoucher) return 0;
    if (cartSubtotal < appliedVoucher.minOrder) return 0;

    if (appliedVoucher.type === 'percent') {
      const discount = (cartSubtotal * appliedVoucher.value) / 100;
      return Math.min(discount, appliedVoucher.maxDiscount);
    } else if (appliedVoucher.type === 'fixed') {
      return Math.min(appliedVoucher.value, cartSubtotal);
    } else if (appliedVoucher.type === 'shipping') {
      return appliedVoucher.value;
    }
    return 0;
  };

  const discountAmount = calculateDiscount();
  const shippingFee = cartSubtotal > 0 ? (cartSubtotal >= 250000 ? 0 : 20000) : 0;
  const cartTotal = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  // Voucher apply
  const applyVoucher = (code) => {
    setVoucherError('');
    const cleanCode = code.trim().toUpperCase();
    const found = vouchers.find((v) => v.code === cleanCode);

    if (!found) {
      setVoucherError('Mã giảm giá không tồn tại hoặc đã hết hạn!');
      return false;
    }

    if (cartSubtotal < found.minOrder) {
      setVoucherError(
        `Đơn hàng chưa đạt mức tối thiểu ${found.minOrder.toLocaleString('vi-VN')}đ để áp dụng mã này!`
      );
      return false;
    }

    setAppliedVoucher(found);
    showToast(`Áp dụng thành công mã ${found.code}!`);
    return true;
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    setVoucherError('');
    showToast('Đã hủy áp dụng voucher.', 'info');
  };

  // Order Operations
  const createOrder = (orderData) => {
    const orderCode = `AV-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder = {
      id: orderCode,
      customerName: orderData.customerName || user.name,
      customerPhone: orderData.customerPhone || user.phone,
      shippingAddress: orderData.shippingAddress || user.address,
      orderDate: formattedDate,
      status: 'pending',
      paymentMethod: orderData.paymentMethod || 'vietqr',
      paymentStatus: orderData.paymentMethod === 'cod' ? 'unpaid' : 'paid',
      shippingFee,
      discountAmount,
      voucherCode: appliedVoucher ? appliedVoucher.code : null,
      totalAmount: cartTotal,
      note: orderData.note || '',
      items: cart.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        spiceLevel: item.spiceLevel,
        image: item.product.image,
      })),
    };

    // Deduct stock
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((c) => c.product.id === p.id);
        if (cartItem) {
          const newStock = Math.max(0, p.stock - cartItem.quantity);
          const newSold = (p.soldCount || 0) + cartItem.quantity;
          return { ...p, stock: newStock, soldCount: newSold };
        }
        return p;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackingId(orderCode);

    // Add Audit Log
    addAuditLog('Tạo đơn hàng mới', `Khách hàng đặt đơn ${orderCode} - Tổng: ${cartTotal.toLocaleString('vi-VN')}đ`);

    // Reset cart
    clearCart();

    // Trigger celebratory confetti effect
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }

    showToast(`Đặt hàng thành công! Mã đơn: ${orderCode}`);
    setCustomerTab('tracking');
    return orderCode;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: newStatus,
            paymentStatus: newStatus === 'completed' ? 'paid' : ord.paymentStatus,
          };
        }
        return ord;
      })
    );

    addAuditLog(
      'Cập nhật trạng thái đơn',
      `Đơn ${orderId} chuyển sang: ${newStatus.toUpperCase()}`
    );
    showToast(`Cập nhật đơn hàng ${orderId} sang trạng thái "${newStatus}"!`);
  };

  const cancelOrder = (orderId, reason = 'Khách yêu cầu hủy') => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return { ...ord, status: 'cancelled', note: `${ord.note} (Lý do hủy: ${reason})` };
        }
        return ord;
      })
    );
    addAuditLog('Hủy đơn hàng', `Đơn ${orderId} bị hủy - Lý do: ${reason}`);
    showToast(`Đã hủy đơn hàng ${orderId}!`, 'info');
  };

  // Product Management (Admin)
  const addProduct = (newProd) => {
    const id = `AV-${Date.now().toString().slice(-4)}`;
    const fullProd = {
      ...newProd,
      id,
      rating: 5.0,
      reviewCount: 0,
      soldCount: 0,
      status: 'available',
    };
    setProducts((prev) => [fullProd, ...prev]);
    addAuditLog('Thêm món mới', `Thêm "${fullProd.name}" vào thực đơn`);
    showToast(`Thêm món "${fullProd.name}" thành công!`);
  };

  const updateProduct = (updatedProd) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProd.id ? { ...p, ...updatedProd } : p))
    );
    addAuditLog('Cập nhật món', `Cập nhật thông tin món ${updatedProd.name} (${updatedProd.id})`);
    showToast(`Đã cập nhật món "${updatedProd.name}"!`);
  };

  const deleteProduct = (productId) => {
    const target = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    addAuditLog('Xóa món', `Xóa món ${target?.name || productId} khỏi hệ thống`);
    showToast('Đã xóa món ăn khỏi thực đơn!', 'info');
  };

  const toggleProductStatus = (productId) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextStatus = p.status === 'available' ? 'out_of_stock' : 'available';
          addAuditLog('Đổi trạng thái món', `${p.name} chuyển sang: ${nextStatus}`);
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  // Voucher Management (Admin)
  const addVoucher = (newVoucher) => {
    setVouchers((prev) => [newVoucher, ...prev]);
    addAuditLog('Tạo Voucher mới', `Tạo voucher ${newVoucher.code} - Giảm ${newVoucher.value}`);
    showToast(`Đã phát hành mã ${newVoucher.code}!`);
  };

  // Reviews
  const addReview = (reviewData) => {
    const newRev = {
      id: Date.now(),
      ...reviewData,
      date: new Date().toLocaleDateString('vi-VN'),
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast('Cảm ơn bạn đã gửi đánh giá cho quán!');
  };

  const hideReview = (reviewId) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    addAuditLog('Ẩn đánh giá', `Admin ẩn đánh giá ID #${reviewId} do vi phạm chính sách`);
    showToast('Đã ẩn đánh giá vi phạm!', 'info');
  };

  // Audit Log
  const addAuditLog = (action, detail) => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog = {
      id: Date.now(),
      time: timeStr,
      user: viewMode === 'admin' ? 'Admin (admin@anvatpro.vn)' : user.name,
      action,
      detail,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Auth Operations
  const login = (email, password, role = 'customer') => {
    if (role === 'admin' || email.includes('admin')) {
      setUser({
        id: 'ADM-01',
        name: 'Quản Trị Viên (Admin)',
        email: 'admin@anvatpro.vn',
        phone: '0988000111',
        role: 'admin',
        shift: 'Toàn ca',
      });
      setViewMode('admin');
      showToast('Đăng nhập Quản trị viên thành công!');
    } else {
      setUser({
        id: 'USR-88',
        name: email.split('@')[0] || 'Khách hàng thân thiết',
        email,
        phone: '0912345678',
        address: '123 Cách Mạng Tháng 8, P.7, Q.3, TP.HCM',
        points: 300,
        role: 'customer',
      });
      showToast(`Chào mừng ${email.split('@')[0]} quay trở lại!`);
    }
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser({
      id: 'GUEST',
      name: 'Khách vãng lai',
      email: '',
      phone: '',
      address: '',
      points: 0,
      role: 'guest',
    });
    setViewMode('customer');
    setCustomerTab('home');
    showToast('Đã đăng xuất tài khoản.', 'info');
  };

  const updateProfile = (profileData) => {
    setUser((prev) => ({ ...prev, ...profileData }));
    showToast('Cập nhật thông tin hồ sơ thành công!');
  };

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        customerTab,
        setCustomerTab,
        adminTab,
        setAdminTab,
        products,
        setProducts,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        shippingFee,
        discountAmount,
        cartTotal,
        vouchers,
        appliedVoucher,
        voucherError,
        applyVoucher,
        removeVoucher,
        orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        activeTrackingId,
        setActiveTrackingId,
        selectedProduct,
        setSelectedProduct,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        reviews,
        addReview,
        hideReview,
        auditLogs,
        addAuditLog,
        user,
        login,
        logout,
        updateProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        toast,
        showToast,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,
        addVoucher,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
