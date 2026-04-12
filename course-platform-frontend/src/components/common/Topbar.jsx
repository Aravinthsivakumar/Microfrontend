import { useAuth } from '../../context/AuthContext'

const Topbar = ({ title }) => {
  const { user } = useAuth()

  return (
    <div className="topbar d-flex justify-content-between align-items-center">
      <h5 className="mb-0 page-title">{title}</h5>
      <div className="d-flex align-items-center gap-3">
        <span className="text-muted" style={{ fontSize: '0.85rem' }}>
          Welcome, <strong>{user?.firstName}</strong>
        </span>
      </div>
    </div>
  )
}

export default Topbar
