import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">User Management System</div>
        <div className="navbar-user">
          <div className="navbar-links" style={{ display: 'flex', gap: '15px' }}>
            {user?.role === 'admin' && (
              <Link to="/admin/dashboard" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
                Dashboard
              </Link>
            )}
            <Link to="/profile" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
              Profile
            </Link>
          </div>
          <div className="user-info">
            <div className="user-name">{user?.fullName}</div>
            <div className="user-role">{user?.role}</div>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
