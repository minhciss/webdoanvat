import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import MenuView from './components/MenuView';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import OrderTrackingView from './components/OrderTrackingView';
import ProfileView from './components/ProfileView';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import Toast from './components/Toast';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProducts from './components/admin/AdminProducts';
import AdminOrders from './components/admin/AdminOrders';
import AdminInventory from './components/admin/AdminInventory';
import AdminVouchers from './components/admin/AdminVouchers';
import AdminReviews from './components/admin/AdminReviews';
import AdminLogs from './components/admin/AdminLogs';

function MainApp() {
  const { viewMode, customerTab, setCustomerTab, adminTab } = useApp();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Switch to Menu with a specific category
  const handleViewAllMenu = () => {
    setCustomerTab('menu');
  };

  if (viewMode === 'admin') {
    return (
      <AdminLayout>
        {adminTab === 'dashboard' && <AdminDashboard />}
        {adminTab === 'products' && <AdminProducts />}
        {adminTab === 'orders' && <AdminOrders />}
        {adminTab === 'inventory' && <AdminInventory />}
        {adminTab === 'vouchers' && <AdminVouchers />}
        {adminTab === 'reviews' && <AdminReviews />}
        {adminTab === 'logs' && <AdminLogs />}
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      {/* Customer Navbar */}
      <Navbar
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
      />

      {/* Main Customer View Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        {customerTab === 'home' && (
          <HomeView
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onViewAllMenu={handleViewAllMenu}
          />
        )}

        {customerTab === 'menu' && (
          <MenuView
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {customerTab === 'cart' && <CartView />}

        {customerTab === 'checkout' && <CheckoutView />}

        {customerTab === 'tracking' && <OrderTrackingView />}

        {customerTab === 'profile' && <ProfileView />}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal />

      {/* Mini Cart Fly-out Drawer */}
      <CartDrawer />

      {/* Authentication Modal */}
      <AuthModal />

      {/* Customer Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
      <Toast />
    </AppProvider>
  );
}
