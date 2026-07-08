import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import BookingForm from './pages/BookingForm';
import AdminDashboard from './pages/AdminDashboard';
import POS from './pages/POS';
import OwnerDashboard from './pages/OwnerDashboard';
import InventoryManagement from './pages/InventoryManagement';
import ServiceManagement from './pages/ServiceManagement';
import TransactionHistory from './pages/TransactionHistory';

import CustomerVehicles from './pages/CustomerVehicles';
import CustomerHistory from './pages/CustomerHistory';
import CustomerBilling from './pages/CustomerBilling';
import AutoEngineDashboard from './pages/AutoEngineDashboard';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/test" element={<AutoEngineDashboard />} />

            {/* Customer only */}
            <Route
              path="/customer"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <Layout><CustomerDashboard /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/vehicles"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <Layout><CustomerVehicles /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/history"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <Layout><CustomerHistory /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/billing"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <Layout><CustomerBilling /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <Layout><BookingForm /></Layout>
                </ProtectedRoute>
              }
            />

            {/* Cashier + Owner */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['cashier', 'owner']}>
                  <Layout><AdminDashboard /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pos"
              element={
                <ProtectedRoute allowedRoles={['cashier', 'owner']}>
                  <Layout><POS /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventories"
              element={
                <ProtectedRoute allowedRoles={['cashier', 'owner']}>
                  <Layout><InventoryManagement /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute allowedRoles={['cashier', 'owner']}>
                  <Layout><TransactionHistory /></Layout>
                </ProtectedRoute>
              }
            />

            {/* Owner only */}
            <Route
              path="/owner"
              element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <Layout><OwnerDashboard /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <Layout><ServiceManagement /></Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
