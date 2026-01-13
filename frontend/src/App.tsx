
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import StaffSignup from './pages/StaffSignup'
import StaffLogin from './pages/StaffLogin'
import StaffDashboard from './pages/StaffDashboard'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ForgotPassword from './pages/ForgotPassword'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Student Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="student" redirectTo="/login">
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Staff Routes */}
        <Route path="/staff/signup" element={<StaffSignup />} />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/staff/forgot-password" element={<ForgotPassword />} />
        <Route path="/staff/dashboard" element={
          <ProtectedRoute requiredRole="staff" redirectTo="/staff/login">
            <StaffDashboard />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin" redirectTo="/admin/login">
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
