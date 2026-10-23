import { orders, products, auditLogs } from '../data/mockStore.js';

export const getDashboardStats = (req, res) => {
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const revenue = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  return res.json({
    success: true,
    data: {
      totalOrders,
      revenue,
      pendingOrders,
      totalProducts: products.length,
      lowStockCount: lowStockProducts.length,
      lowStockItems: lowStockProducts,
    },
  });
};

export const getAuditLogs = (req, res) => {
  return res.json({ success: true, count: auditLogs.length, data: auditLogs });
};
