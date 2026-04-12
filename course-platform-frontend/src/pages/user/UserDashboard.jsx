import { useEffect, useState } from 'react'
import Layout from '../../components/common/Layout'
import { userAPI } from '../../api/services'
import { Spinner, StatusBadge } from '../../components/common/UI'
import { useAuth } from '../../context/AuthContext'

const UserDashboard = () => {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [requests, setRequests] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      userAPI.getEnrolledCourses(),
      userAPI.getMyCourseRequests(),
      userAPI.getNotifications(),
    ]).then(([e, r, n]) => {
      setEnrollments(e.data)
      setRequests(r.data)
      setNotifications(n.data)
    }).catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const unread = notifications.filter((n) => !n.read).length

  return (
    <Layout title="My Dashboard">
      {loading ? <Spinner /> : (
        <>
          {/* Welcome Banner */}
          <div className="p-4 rounded-3 mb-4 text-white" style={{ background: 'linear-gradient(135deg,#4f46e5,#06b6d4)' }}>
            <h5 className="fw-bold mb-1">Welcome back, {user?.firstName}! 👋</h5>
            <p className="mb-0 opacity-75">Continue your learning journey</p>
          </div>

          <div className="row g-3 mb-4">
            {[
              { label: 'Enrolled Courses', value: enrollments.length, icon: 'bi-journal-check', color: '#4f46e5' },
              { label: 'My Requests', value: requests.length, icon: 'bi-send', color: '#06b6d4' },
              { label: 'Unread Alerts', value: unread, icon: 'bi-bell', color: '#f59e0b' },
            ].map((s) => (
              <div className="col-sm-4" key={s.label}>
                <div className="card stat-card p-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}>
                      <i className={`bi ${s.icon}`} />
                    </div>
                    <div>
                      <div className="text-muted" style={{ fontSize: '0.8rem' }}>{s.label}</div>
                      <div className="fw-bold fs-4">{s.value}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4">
            <div className="col-lg-7">
              <div className="card table-card">
                <div className="card-header bg-white border-0 pt-3 d-flex justify-content-between">
                  <h6 className="fw-bold mb-0">My Enrollments</h6>
                  <a href="/user/enrollments" className="btn btn-sm btn-outline-primary">View All</a>
                </div>
                <div className="card-body p-0">
                  <table className="table mb-0">
                    <thead><tr><th>Course</th><th>Status</th></tr></thead>
                    <tbody>
                      {enrollments.length === 0 ? (
                        <tr><td colSpan={2} className="text-center text-muted py-3">No enrollments yet. <a href="/user/courses">Browse courses</a></td></tr>
                      ) : enrollments.slice(0, 5).map((e) => (
                        <tr key={e.id}>
                          <td className="fw-semibold">{e.courseTitle || '—'}</td>
                          <td><StatusBadge status={e.status || 'ACTIVE'} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card table-card">
                <div className="card-header bg-white border-0 pt-3 d-flex justify-content-between">
                  <h6 className="fw-bold mb-0">Recent Notifications</h6>
                  <a href="/user/notifications" className="btn btn-sm btn-outline-secondary">View All</a>
                </div>
                <ul className="list-group list-group-flush">
                  {notifications.length === 0 ? (
                    <li className="list-group-item text-center text-muted">No notifications.</li>
                  ) : notifications.slice(0, 5).map((n) => (
                    <li key={n.id} className={`list-group-item ${!n.read ? 'bg-light' : ''}`} style={{ fontSize: '0.85rem' }}>
                      <div className="d-flex align-items-start gap-2">
                        {!n.read && <span className="notification-dot mt-1 flex-shrink-0" />}
                        <span>{n.message}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}

export default UserDashboard
