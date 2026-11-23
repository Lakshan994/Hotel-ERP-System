import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Customers from './pages/Customers';
import Reservations from './pages/Reservations';
import Billing from './pages/Billing';
export default function App() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="customers" element={<Customers />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="billing" element={<Billing />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
