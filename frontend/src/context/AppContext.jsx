import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  INITIAL_PRODUCTS,
  AVAILABLE_VOUCHERS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_CUSTOMERS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';
import confetti from 'canvas-confetti';

const AppContext = createContext();

// Helper to parse current URL hash into viewMode and active tabs
export const parseHashRoute = (hashString) => {
  const hash = hashString || (typeof window !== 'undefined' ? window.location.hash : '') || '#home';

  if (hash.startsWith('#admin')) {
    const tab = hash.replace('#admin-', '').trim() || 'dashboard';
    const validAdminTabs = [
      'dashboard',
      'products',
      'orders',
      'customers',
      'inventory',
      'vouchers',
      'reviews',
      'logs',
    ];
    return {
      viewMode: 'admin',
      adminTab: validAdminTabs.includes(tab) ? tab : 'dashboard',
      customerTab: 'home',
      activeTrackingId: 'AV-89211',
      productId: null,
    };
  }

  if (hash.startsWith('#product-')) {
    const prodId = hash.replace('#product-', '').trim();
    return {
      viewMode: 'customer',
      adminTab: 'dashboard',
      customerTab: 'product-detail',
      activeTrackingId: 'AV-89211',
      productId: prodId,
    };
  }

  if (hash.startsWith('#tracking')) {
    const match = hash.match(/\?id=([^&]+)/);
    const trackingId = match && match[1] ? decodeURIComponent(match[1]) : 'AV-89211';
    return {
      viewMode: 'customer',
      adminTab: 'dashboard',
      customerTab: 'tracking',
      activeTrackingId: trackingId,
      productId: null,
    };
  }

  const cleanCustomer = hash.replace('#', '').trim();
  const validCustomerTabs = ['home', 'menu', 'cart', 'checkout', 'profile', 'product-detail'];
  if (validCustomerTabs.includes(cleanCustomer)) {
    return {
      viewMode: 'customer',
      adminTab: 'dashboard',
      customerTab: cleanCustomer,
      activeTrackingId: 'AV-89211',
      productId: null,
    };
  }

  return {
    viewMode: 'customer',
    adminTab: 'dashboard',
    customerTab: 'home',
    activeTrackingId: 'AV-89211',
    productId: null,
  };
};

export function AppProvider({ children }) {
  // Parse initial route from window.location.hash once on mount
  const initialRoute = useRef(parseHashRoute(typeof window !== 'undefined' ? window.location.hash : '')).current;

  // Navigation / View modes (initialized from current URL hash so F5 stays on current page!)
  const [viewMode, setViewMode] = useState(initialRoute.viewMode); // 'customer' | 'admin'
  const [customerTab, setCustomerTab] = useState(initialRoute.customerTab); // 'home' | 'menu' | 'cart' | 'checkout' | 'tracking' | 'profile' | 'product-detail'
  const [adminTab, setAdminTab] = useState(initialRoute.adminTab); // 'dashboard' | 'products' | 'orders' | 'customers' | 'inventory' | 'vouchers' | 'reviews' | 'logs'

  // Products
  const [products, setProducts] = useState(() => {
    const savedVersion = localStorage.getItem('anvat_products_version');
    const saved = localStorage.getItem('anvat_products');
    if (saved && savedVersion === 'v4_flan_accurate_sauce_no_ice') {
      return JSON.parse(saved);
    }
    localStorage.setItem('anvat_products_version', 'v4_flan_accurate_sauce_no_ice');
    localStorage.setItem('anvat_products', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
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
    const savedVersion = localStorage.getItem('anvat_orders_version');
    const saved = localStorage.getItem('anvat_orders');
    if (saved && savedVersion === 'v3_user_specific_orders') {
      return JSON.parse(saved);
    }
    localStorage.setItem('anvat_orders_version', 'v3_user_specific_orders');
    localStorage.setItem('anvat_orders', JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  });
  const [activeTrackingId, setActiveTrackingId] = useState(initialRoute.activeTrackingId || 'AV-89211');

  // Reviews (persisted to localStorage)
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('anvat_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem('anvat_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // User Authentication (null by default if not logged in, loaded from localStorage)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('anvat_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role !== 'guest' && parsed.id !== 'GUEST') {
          return parsed;
        }
        return null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Always keep non-guest user synced with localStorage so F5 NEVER logs out!
  useEffect(() => {
    if (user && user.role !== 'guest' && user.id !== 'GUEST') {
      localStorage.setItem('anvat_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('anvat_user');
    }
  }, [user]);

  // Customers Management (Admin)
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('anvat_customers');
    const savedVersion = localStorage.getItem('anvat_customers_version');
    if (saved && savedVersion === 'v3_auto_sync_minhzz') {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CUSTOMERS;
      }
    }
    localStorage.setItem('anvat_customers_version', 'v3_auto_sync_minhzz');
    // Merge existing saved customers with INITIAL_CUSTOMERS (including minhzz0201)
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const map = new Map();
        INITIAL_CUSTOMERS.forEach((c) => map.set((c.email || c.id).toLowerCase(), c));
        parsed.forEach((c) => {
          const key = (c.email || c.id).toLowerCase();
          map.set(key, { ...map.get(key), ...c });
        });
        const merged = Array.from(map.values());
        localStorage.setItem('anvat_customers', JSON.stringify(merged));
        return merged;
      } catch (e) {}
    }
    localStorage.setItem('anvat_customers', JSON.stringify(INITIAL_CUSTOMERS));
    return INITIAL_CUSTOMERS;
  });

  useEffect(() => {
    localStorage.setItem('anvat_customers', JSON.stringify(customers));
  }, [customers]);

  // Always auto-sync logged-in customer into `customers` list so Admin always sees them!
  useEffect(() => {
    if (user && user.role !== 'guest' && user.id !== 'GUEST' && user.role !== 'admin') {
      setCustomers((prev) => {
        const index = prev.findIndex(
          (c) =>
            (c.email && user.email && c.email.toLowerCase() === user.email.toLowerCase()) ||
            (c.phone && user.phone && c.phone.trim() === user.phone.trim()) ||
            c.id === user.id
        );
        if (index > -1) {
          const existing = prev[index];
          if (
            existing.name !== user.name ||
            existing.points !== user.points ||
            existing.phone !== user.phone ||
            existing.address !== user.address
          ) {
            const updated = [...prev];
            updated[index] = { ...existing, ...user };
            return updated;
          }
          return prev;
        } else {
          const newCust = {
            id: user.id || `USR-${Math.floor(10 + Math.random() * 90)}`,
            name: user.name || user.email?.split('@')[0] || 'Khách hàng',
            email: user.email || '',
            phone: user.phone || '0912020101',
            address: user.address || '123 Cách Mạng Tháng 8, P.7, Q.3, TP.HCM',
            points: user.points !== undefined ? user.points : 300,
            orderCount: user.orderCount || 0,
            totalSpent: user.totalSpent || 0,
            rank: user.rank || (user.points >= 200 ? 'VIP' : 'Thành viên'),
            status: 'active',
            joinedDate: new Date().toLocaleDateString('vi-VN'),
            note: 'Tài khoản thành viên đăng nhập.',
          };
          return [newCust, ...prev];
        }
      });
    }
  }, [user]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Product Detail Modal
  const [selectedProduct, setSelectedProduct] = useState(() => {
    if (initialRoute.productId) {
      try {
        const saved = localStorage.getItem('anvat_products');
        const list = saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
        return list.find((p) => p.id === initialRoute.productId) || null;
      } catch (e) {
        return INITIAL_PRODUCTS.find((p) => p.id === initialRoute.productId) || null;
      }
    }
    return null;
  });

  const viewProductDetail = (product) => {
    setSelectedProduct(product);
    setCustomerTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Browser History & URL Hash Synchronization (Back / Forward Button & F5 Support)
  const isPopStateRef = useRef(false);
  const isInitialMountRef = useRef(true);

  const getHash = () => {
    if (viewMode === 'admin') {
      return `#admin-${adminTab || 'dashboard'}`;
    }
    if (customerTab === 'product-detail' && selectedProduct) {
      return `#product-${selectedProduct.id}`;
    }
    if (customerTab === 'tracking') {
      return activeTrackingId ? `#tracking?id=${activeTrackingId}` : '#tracking';
    }
    if (customerTab === 'home') {
      return '#home';
    }
    return `#${customerTab}`;
  };

  // Push history state whenever tab / product / tracking changes
  useEffect(() => {
    const targetHash = getHash();

    // On initial mount: if URL already has a valid hash, do not overwrite with #home!
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      if (!window.location.hash || window.location.hash === '#') {
        window.history.replaceState(
          {
            viewMode,
            customerTab,
            adminTab,
            selectedProductId: selectedProduct?.id,
            activeTrackingId,
          },
          '',
          '#home'
        );
      }
      return;
    }

    if (isPopStateRef.current) {
      isPopStateRef.current = false;
      return;
    }

    if (window.location.hash !== targetHash) {
      window.history.pushState(
        {
          viewMode,
          customerTab,
          adminTab,
          selectedProductId: selectedProduct?.id,
          activeTrackingId,
        },
        '',
        targetHash
      );
    }
  }, [viewMode, customerTab, adminTab, selectedProduct, activeTrackingId]);

  // Handle browser Back / Forward buttons (popstate event)
  useEffect(() => {
    const handlePopState = () => {
      isPopStateRef.current = true;
      const parsed = parseHashRoute(window.location.hash);
      setViewMode(parsed.viewMode);
      setAdminTab(parsed.adminTab);
      setCustomerTab(parsed.customerTab);
      if (parsed.activeTrackingId) {
        setActiveTrackingId(parsed.activeTrackingId);
      }
      if (parsed.productId) {
        const found = products.find((p) => p.id === parsed.productId);
        if (found) {
          setSelectedProduct(found);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products]);

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
      userId: user?.id || 'GUEST',
      customerName: orderData.customerName || user?.name || 'Khách vãng lai',
      customerPhone: orderData.customerPhone || user?.phone || '',
      shippingAddress: orderData.shippingAddress || user?.address || '',
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

    // Update customer stats
    if (user && user.role !== 'admin') {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === user.id || (c.email && user.email && c.email.toLowerCase() === user.email.toLowerCase())) {
            const nextOrderCount = (c.orderCount || 0) + 1;
            const nextTotalSpent = (c.totalSpent || 0) + cartTotal;
            const nextRank = nextTotalSpent >= 500000 ? 'Kim Cương' : nextTotalSpent >= 200000 ? 'VIP' : 'Thành viên';
            return {
              ...c,
              orderCount: nextOrderCount,
              totalSpent: nextTotalSpent,
              rank: nextRank,
            };
          }
          return c;
        })
      );
    }

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

  // Customer Management (Admin)
  const addCustomer = (customerData) => {
    const newCust = {
      id: `USR-${Math.floor(10 + Math.random() * 90)}`,
      ...customerData,
      points: Number(customerData.points) || 0,
      orderCount: 0,
      totalSpent: 0,
      status: 'active',
      joinedDate: new Date().toLocaleDateString('vi-VN'),
    };
    setCustomers((prev) => [newCust, ...prev]);
    addAuditLog('Thêm khách hàng', `Tạo tài khoản khách hàng mới: ${newCust.name} (${newCust.phone})`);
    showToast(`Đã thêm khách hàng "${newCust.name}" thành công!`);
  };

  const updateCustomer = (id, customerData) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...customerData } : c))
    );
    // If updating current logged in user
    if (user && user.id === id) {
      setUser((prev) => ({ ...prev, ...customerData }));
    }
    addAuditLog('Cập nhật khách hàng', `Sửa thông tin khách hàng ID #${id}`);
    showToast('Cập nhật thông tin khách hàng thành công!');
  };

  const toggleCustomerStatus = (id) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'blocked' ? 'active' : 'blocked';
          addAuditLog('Đổi trạng thái khách', `Khách hàng ${c.name} chuyển sang: ${nextStatus}`);
          showToast(`Đã ${nextStatus === 'blocked' ? 'khóa' : 'mở khóa'} tài khoản ${c.name}!`, nextStatus === 'blocked' ? 'error' : 'success');
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const adjustCustomerPoints = (id, diff, reason) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newPts = Math.max(0, (c.points || 0) + diff);
          return { ...c, points: newPts };
        }
        return c;
      })
    );
    if (user && user.id === id) {
      setUser((prev) => ({ ...prev, points: Math.max(0, (prev.points || 0) + diff) }));
    }
    addAuditLog('Điều chỉnh điểm thưởng', `Khách ID #${id} ${diff > 0 ? '+' : ''}${diff} Xu - Lý do: ${reason}`);
    showToast(`Đã ${diff > 0 ? 'cộng' : 'trừ'} ${Math.abs(diff)} Xu thành công!`);
  };

  const deleteCustomer = (id) => {
    const target = customers.find((c) => c.id === id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    addAuditLog('Xóa khách hàng', `Xóa tài khoản khách ${target?.name || id}`);
    showToast('Đã xóa tài khoản khách hàng khỏi hệ thống!', 'info');
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
      isNew: newProd.isNew !== undefined ? newProd.isNew : true,
      createdAt: new Date().toISOString(),
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
    setUser((prev) => ({ ...prev, points: (prev.points || 0) + 20 }));
    showToast('Cảm ơn bạn đã gửi đánh giá! (+20 Xu tích lũy)');
  };

  const reviewOrder = (orderId, rating, comment) => {
    const numRating = Number(rating) || 5;
    const cleanComment = (comment || '').trim() || 'Món ăn rất ngon, hương vị chuẩn quán, đóng gói cẩn thận!';
    const orderIdStr = String(orderId || '').trim();

    // 1. Update orders in state and localStorage
    setOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.id && ord.id.toUpperCase() === orderIdStr.toUpperCase()) {
          return {
            ...ord,
            reviewed: true,
            rating: numRating,
            reviewComment: cleanComment,
            reviewedAt: new Date().toLocaleDateString('vi-VN'),
          };
        }
        return ord;
      });
      localStorage.setItem('anvat_orders', JSON.stringify(updated));
      return updated;
    });

    // 2. Save reviews for each item in the order
    const targetOrder = orders.find(
      (o) => o.id && o.id.toUpperCase() === orderIdStr.toUpperCase()
    );

    if (targetOrder?.items && targetOrder.items.length > 0) {
      const newItemsReviews = targetOrder.items.map((item, idx) => ({
        id: Date.now() + idx,
        productId: item.id || item.productId,
        productName: item.name,
        userName: targetOrder.customerName || user?.name || 'Khách hàng',
        rating: numRating,
        comment: cleanComment,
        spiceLevel: item.spiceLevel || 'Chuẩn vị',
        date: new Date().toLocaleDateString('vi-VN'),
      }));
      setReviews((prev) => [...newItemsReviews, ...prev]);
    }

    // 3. Award loyalty points (+20 xu)
    if (user) {
      setUser((prev) => (prev ? { ...prev, points: (prev.points || 0) + 20 } : prev));
    }
    setCustomers((prev) =>
      prev.map((c) => {
        if (
          (user && c.id === user.id) ||
          (targetOrder && c.phone === targetOrder.customerPhone)
        ) {
          return { ...c, points: (c.points || 0) + 20 };
        }
        return c;
      })
    );

    addAuditLog('Khách đánh giá đơn hàng', `Đơn #${orderIdStr} được đánh giá ${numRating} sao: "${cleanComment}"`);

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    showToast('Đã gửi đánh giá thành công! Bạn nhận được +20 Xu ĂnVặt.');
  };

  const replyReview = (reviewId, replyText) => {
    const cleanText = (replyText || '').trim();
    if (!cleanText) {
      showToast('Vui lòng nhập nội dung phản hồi!', 'error');
      return;
    }

    const replyDate = new Date().toLocaleDateString('vi-VN');
    setReviews((prev) => {
      const updated = prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            reply: cleanText,
            replyDate,
            repliedBy: 'ĂnVặtPro (Chủ quán)',
          };
        }
        return r;
      });
      localStorage.setItem('anvat_reviews', JSON.stringify(updated));
      return updated;
    });

    addAuditLog('Phản hồi đánh giá', `Chủ quán trả lời đánh giá #${reviewId}: "${cleanText}"`);
    showToast('Đã gửi phản hồi thành công đến thực khách!');
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
      user: viewMode === 'admin' ? 'Admin (admin@anvatpro.vn)' : user?.name || 'Người dùng',
      action,
      detail,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Auth Operations
  const login = (email, password, role = 'customer') => {
    const cleanEmail = (email || '').trim();
    if (role === 'admin' || cleanEmail.toLowerCase().includes('admin')) {
      const adminUser = {
        id: 'ADM-01',
        name: 'Quản Trị Viên (Admin)',
        email: 'admin@anvatpro.vn',
        phone: '0988000111',
        role: 'admin',
        shift: 'Toàn ca',
      };
      setUser(adminUser);
      localStorage.setItem('anvat_user', JSON.stringify(adminUser));
      setViewMode('admin');
      showToast('Đăng nhập Quản trị viên thành công!');
    } else {
      const matchedCustomer = customers.find(
        (c) =>
          (c.email && c.email.toLowerCase() === cleanEmail.toLowerCase()) ||
          (c.phone && c.phone.trim() === cleanEmail)
      );

      const custUser = matchedCustomer || {
        id: `USR-${Math.floor(10 + Math.random() * 90)}`,
        name: cleanEmail ? cleanEmail.split('@')[0] : 'Khách hàng',
        email: cleanEmail || 'khachhang@anvatpro.vn',
        phone: '0912020101',
        address: '123 Cách Mạng Tháng 8, P.7, Q.3, TP.HCM',
        points: 300,
        orderCount: 0,
        totalSpent: 0,
        rank: 'VIP',
        status: 'active',
        joinedDate: new Date().toLocaleDateString('vi-VN'),
        role: 'customer',
      };

      if (!matchedCustomer) {
        setCustomers((prev) => [custUser, ...prev]);
      }

      setUser(custUser);
      localStorage.setItem('anvat_user', JSON.stringify(custUser));
      showToast(`Chào mừng ${custUser.name} quay trở lại!`);
    }
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('anvat_user');
    setViewMode('customer');
    setCustomerTab('home');
    showToast('Đã đăng xuất tài khoản thành công.', 'info');
  };

  const updateProfile = (profileData) => {
    setUser((prev) => ({ ...prev, ...profileData }));
    setCustomers((prev) =>
      prev.map((c) => {
        if (
          user &&
          (c.id === user.id ||
            (c.email && user.email && c.email.toLowerCase() === user.email.toLowerCase()))
        ) {
          return { ...c, ...profileData };
        }
        return c;
      })
    );
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
        reviewOrder,
        customers,
        setCustomers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        toggleCustomerStatus,
        adjustCustomerPoints,
        activeTrackingId,
        setActiveTrackingId,
        selectedProduct,
        setSelectedProduct,
        viewProductDetail,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        reviews,
        addReview,
        hideReview,
        replyReview,
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
