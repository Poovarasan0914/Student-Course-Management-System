
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import StaffSignup from './pages/StaffSignup'
import StaffLogin from './pages/StaffLogin'
import StaffDashboard from './pages/StaffDashboard'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        {/* Student Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="student" redirectTo="/login">
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Staff Routes */}
        <Route path="/staff/signup" element={<StaffSignup />} />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/staff/dashboard" element={
          <ProtectedRoute requiredRole="staff" redirectTo="/staff/login">
            <StaffDashboard />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin" redirectTo="/admin/login">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/signup" replace />} />
      </Routes>
    </Router>
  )
}

export default App
