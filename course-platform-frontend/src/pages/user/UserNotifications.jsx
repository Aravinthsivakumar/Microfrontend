import { useEffect, useState } from 'react'
import Layout from '../../components/common/Layout'
import { userAPI } from '../../api/services'
import { Spinner, Alert } from '../../components/common/UI'

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [marking, setMarking] = useState(false)

  const fetchNotifications = () => {
    setLoading(true)
    userAPI.getNotifications()
      .then(({ data }) => setNotifications(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchNotifications() }, [])

  const markRead = async (id) => {
    try {
      await userAPI.markNotificationRead(id)
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
    } catch { /* ignore */ }
  }

  const markAll = async () => {
    setMarking(true)
    try {
      await userAPI.markAllRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setMessage({ type: 'success', text: 'All notifications marked as read.' })
    } catch {
      setMessage({ type: 'danger', text: 'Failed to mark all as read.' })
    } finally {
      setMarking(false)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Layout title="Notifications">
      <Alert type={message.type} message={message.text} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</span>
        {unreadCount > 0 && (
          <button className="btn btn-sm btn-outline-primary" onClick={markAll} disabled={marking}>
            {marking ? <span className="spinner-border spinner-border-sm me-1" /> : <i className="bi bi-check-all me-1" />}
            Mark All Read
          </button>
        )}
      </div>

      <div className="card table-card">
        <div className="card-body p-0">
          {loading ? <Spinner /> : notifications.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-bell-slash display-5 d-block mb-2" />
              No notifications yet.
            </div>
          ) : (
            <ul className="list-group list-group-flush">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`list-group-item d-flex align-items-start gap-3 py-3 ${!n.read ? 'bg-light' : ''}`}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: n.read ? '#cbd5e1' : '#4f46e5',
                      marginTop: 5
                    }} />
                  </div>
                  <div className="flex-grow-1">
                    <div style={{ fontSize: '0.88rem' }}>{n.message}</div>
                    {n.createdAt && (
                      <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                        <i className="bi bi-clock me-1" />
                        {new Date(n.createdAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                  {!n.read && (
                    <button className="btn btn-sm btn-outline-secondary flex-shrink-0" onClick={() => markRead(n.id)}>
                      Mark Read
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default UserNotifications
