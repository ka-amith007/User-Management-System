import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminDashboard from './pages/AdminDashboard'
import UserProfile from './pages/UserProfile'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/profile'} /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/profile'} /> : <Signup />} 
        />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<UserProfile />} />
        </Route>

        <Route 
          path="/" 
          element={<Navigate to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/profile') : '/login'} />} 
        />
      </Routes>
    </Router>
  )
}

export default App
