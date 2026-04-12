import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const adminLinks = [
  { to: '/admin/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
  { to: '/admin/users', icon: 'bi-people', label: 'Users' },
  { to: '/admin/courses', icon: 'bi-collection', label: 'Courses' },
  { to: '/admin/trainer-requests', icon: 'bi-person-check', label: 'Trainer Requests' },
  { to: '/admin/feedback', icon: 'bi-chat-dots', label: 'Feedback' },
  { to: '/admin/reports', icon: 'bi-bar-chart-line', label: 'Reports' },
]

const trainerLinks = [
  { to: '/trainer/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
  { to: '/trainer/courses', icon: 'bi-collection', label: 'My Courses' },
  { to: '/trainer/requests', icon: 'bi-inbox', label: 'Course Requests' },
  { to: '/trainer/students', icon: 'bi-people', label: 'Students' },
]

const userLinks = [
  { to: '/user/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
  { to: '/user/courses', icon: 'bi-search', label: 'Browse Courses' },
  { to: '/user/enrollments', icon: 'bi-journal-check', label: 'My Enrollments' },
  { to: '/user/requests', icon: 'bi-send', label: 'My Requests' },
  { to: '/user/notifications', icon: 'bi-bell', label: 'Notifications' },
  { to: '/user/profile', icon: 'bi-person-circle', label: 'Profile' },
]

const Sidebar = () => {
  const { user, logout, isAdmin, isTrainer } = useAuth()
  const navigate = useNavigate()

  const links = isAdmin() ? adminLinks : isTrainer() ? trainerLinks : userLinks

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="sidebar d-flex flex-column">
      <div className="sidebar-brand">
        <div className="d-flex align-items-center gap-2">
          <div style={{
            width: 36, height: 36, borderRadius: '0.6rem',
            background: 'linear-gradient(135deg,#818cf8,#06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <i className="bi bi-mortarboard-fill text-white" style={{ fontSize: '1rem' }} />
          </div>
          <div>
            <div className="text-white fw-bold" style={{ fontSize: '0.95rem', lineHeight: 1.1 }}>CoursePlatform</div>
            <div className="text-white-50" style={{ fontSize: '0.7rem' }}>
              {isAdmin() ? 'Admin Panel' : isTrainer() ? 'Trainer Panel' : 'Student Panel'}
            </div>
          </div>
        </div>
      </div>

      <div className="py-3 flex-grow-1">
        <div className="px-3 mb-2">
          <span className="text-white-50" style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Navigation
          </span>
        </div>
        <ul className="nav flex-column">
          {links.map((link) => (
            <li className="nav-item" key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => `nav-link d-flex align-items-center${isActive ? ' active' : ''}`}
              >
                <i className={`bi ${link.icon}`} />
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
        <div className="d-flex align-items-center gap-2 mb-3">
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg,#818cf8,#06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem', color: '#fff', fontWeight: 700
          }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <div className="text-white fw-semibold" style={{ fontSize: '0.82rem' }}>
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-white-50" style={{ fontSize: '0.7rem' }}>{user?.email}</div>
          </div>
        </div>
        <button className="btn btn-sm w-100 text-white" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '0.5rem' }} onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-2" />Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar
