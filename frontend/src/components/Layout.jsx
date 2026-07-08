import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  Menu,
  X,
  LogOut,
  Bell,
  User,
  BarChart3,
  Package,
  ShoppingCart,
  Wrench,
  CreditCard,
  Receipt,
  ChevronDown,
  Car,
  History,
  FileText
} from 'lucide-react';

import PromoToast from './PromoToast';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { notifications, clearNotifications } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    setNotificationsOpen(false);
    setUserMenuOpen(false);
    setMobileMenuOpen(false); // close mobile menu on route change
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavItems = () => {
    const baseItems = [
      {
        label: 'Dashboard',
        icon: BarChart3,
        path: getDashboardLink(),
      },
    ];

    if (user?.role === 'owner') {
      return [
        ...baseItems,
        { label: 'Pesanan', icon: ShoppingCart, path: '/admin' },
        { label: 'Layanan', icon: Wrench, path: '/services' },
        { label: 'Inventori', icon: Package, path: '/inventories' },
        { label: 'POS', icon: CreditCard, path: '/pos' },
        { label: 'Transaksi', icon: Receipt, path: '/transactions' },
      ];
    }

    if (user?.role === 'cashier') {
      return [
        ...baseItems,
        { label: 'Pesanan', icon: ShoppingCart, path: '/admin' },
        { label: 'Inventori', icon: Package, path: '/inventories' },
        { label: 'POS', icon: CreditCard, path: '/pos' },
        { label: 'Transaksi', icon: Receipt, path: '/transactions' },
      ];
    }

    if (user?.role === 'customer') {
      return [
        ...baseItems,
        { label: 'Garasi Saya', icon: Car, path: '/customer/vehicles' },
        { label: 'Riwayat Servis', icon: History, path: '/customer/history' },
        { label: 'Tagihan', icon: FileText, path: '/customer/billing' },
        { label: 'Pesan Layanan', icon: ShoppingCart, path: '/booking' },
      ];
    }

    return baseItems;
  };

  const getDashboardLink = () => {
    if (user?.role === 'customer') return '/customer';
    if (user?.role === 'cashier') return '/admin';
    if (user?.role === 'owner') return '/owner';
    return '/';
  };

  const isActive = (path) => location.pathname === path;

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-neutral-0 overflow-hidden">
      {/* ── Mobile overlay backdrop ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      {/* Desktop: icon-only → hover expand */}
      {/* Mobile: hidden by default, slide in when mobileMenuOpen */}
      <div
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
        className={`
          bg-neutral-900 text-neutral-0 flex flex-col border-r border-neutral-800 flex-shrink-0
          transition-all duration-300 ease-in-out
          /* Desktop */
          hidden lg:flex
          ${sidebarExpanded ? 'lg:w-64' : 'lg:w-20'}
          /* Mobile: fixed drawer */
          ${mobileMenuOpen
            ? 'fixed inset-y-0 left-0 w-72 flex z-50'
            : 'fixed inset-y-0 -left-72 w-72 flex z-50 lg:static lg:left-auto'
          }
        `}
        style={{ cursor: 'default' }}
      >
        {/* Sidebar logo / header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-neutral-800 overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 flex-shrink-0">
              <Menu className="w-5 h-5 text-neutral-400" />
            </div>
            <span
              className={`text-sm font-medium text-neutral-300 uppercase tracking-[0.2em] whitespace-nowrap transition-opacity duration-300 ${
                sidebarExpanded || mobileMenuOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'
              }`}
            >
              Navigasi
            </span>
          </div>
          {/* Close button — mobile only */}
          <button
            className="lg:hidden p-2 text-neutral-400 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
                  active
                    ? 'bg-primary text-white'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100'
                }`}
                title={!sidebarExpanded && !mobileMenuOpen ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span
                  className={`text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${
                    sidebarExpanded || mobileMenuOpen
                      ? 'opacity-100'
                      : 'opacity-0 w-0 overflow-hidden lg:opacity-0'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout button at bottom */}
        <div className="px-3 py-4 border-t border-neutral-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-neutral-400 hover:bg-red-900/40 hover:text-red-300 transition-all"
            title={!sidebarExpanded && !mobileMenuOpen ? 'Keluar' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span
              className={`text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${
                sidebarExpanded || mobileMenuOpen
                  ? 'opacity-100'
                  : 'opacity-0 w-0 overflow-hidden'
              }`}
            >
              Keluar
            </span>
          </button>
        </div>
      </div>

      {/* Mobile sidebar drawer (separate element for better control) */}
      <div
        className={`
          fixed inset-y-0 left-0 w-72 bg-neutral-900 text-neutral-0 flex flex-col border-r border-neutral-800 z-50
          transition-transform duration-300 ease-in-out lg:hidden
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-neutral-800">
          <span className="text-sm font-medium text-neutral-300 uppercase tracking-[0.2em]">Navigasi</span>
          <button
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-primary text-white'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* logout */}
        <div className="px-3 py-4 border-t border-neutral-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-neutral-400 hover:bg-red-900/40 hover:text-red-300 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Keluar</span>
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-neutral-0 border-b border-neutral-200 shadow-sm px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center justify-between h-full gap-4">
            {/* Left — hamburger on mobile */}
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                id="btn-mobile-menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Center logo */}
            <div className="flex items-center justify-center flex-1">
              <img src="/logo_panjang.png" alt="Auto Engine" className="h-8 object-contain" />
            </div>

            {/* Right — notifications + user */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => { setNotificationsOpen(!notificationsOpen); setUserMenuOpen(false); }}
                  className="relative p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                  id="btn-notifications"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 lg:w-96 bg-neutral-0 rounded-lg shadow-xl border border-neutral-200 z-50">
                    <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
                      <h3 className="font-semibold text-neutral-900">
                        Notifikasi
                        {notifications.length > 0 && (
                          <span className="ml-2 text-xs bg-primary text-white rounded-full px-2 py-0.5">
                            {notifications.length}
                          </span>
                        )}
                      </h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={clearNotifications}
                          className="text-xs text-accent hover:text-accent-dark transition-colors"
                        >
                          Hapus semua
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-neutral-500 text-sm">
                          Tidak ada notifikasi
                        </div>
                      ) : (
                        notifications.slice().reverse().map((notif, index) => (
                          <div
                            key={index}
                            className="px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 transition-colors text-sm text-neutral-700"
                          >
                            <div className="flex items-start gap-2">
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                notif.type === 'stock' ? 'bg-yellow-500' :
                                notif.type === 'transaction' ? 'bg-green-500' :
                                notif.type === 'booking' ? 'bg-blue-500' : 'bg-accent'
                              }`} />
                              <div>
                                <p className="text-neutral-800">{notif.message}</p>
                                {notif.timestamp && (
                                  <p className="text-xs text-neutral-400 mt-0.5">
                                    {notif.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => { setUserMenuOpen(!userMenuOpen); setNotificationsOpen(false); }}
                  className="flex items-center gap-2 p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                  id="btn-user-menu"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">{user?.nama}</span>
                  <ChevronDown className={`hidden sm:block w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-neutral-0 rounded-lg shadow-xl border border-neutral-200 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-neutral-200">
                      <p className="text-xs text-neutral-500">Akun</p>
                      <p className="text-sm font-medium text-neutral-900 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full capitalize">
                        {user?.role}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-neutral-700 hover:bg-red-50 hover:text-red-600 transition-colors text-sm"
                      id="btn-logout"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
      
      {/* Floating Widgets */}
      {user?.role === 'customer' && <PromoToast />}
    </div>
  );
};

export default Layout;
