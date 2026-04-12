import { useEffect, useState } from 'react'
import Layout from '../../components/common/Layout'
import { adminAPI } from '../../api/services'
import { Spinner } from '../../components/common/UI'

const StatCard = ({ icon, label, value, color }) => (
  <div className="col-sm-6 col-xl-3">
    <div className="card stat-card p-3">
      <div className="d-flex align-items-center gap-3">
        <div className="stat-icon" style={{ background: `${color}20`, color }}>
          <i className={`bi ${icon}`} />
        </div>
        <div>
          <div className="text-muted" style={{ fontSize: '0.8rem' }}>{label}</div>
          <div className="fw-bold fs-4">{value ?? '—'}</div>
        </div>
      </div>
    </div>
  </div>
)

const AdminDashboard = () => {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.getReport()
      .then(({ data }) => setReport(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout title="Admin Dashboard">
      {loading ? <Spinner /> : (
        <>
          <div className="row g-3 mb-4">
            <StatCard icon="bi-people-fill" label="Total Users" value={report?.totalUsers} color="#4f46e5" />
            <StatCard icon="bi-collection-fill" label="Total Courses" value={report?.totalCourses} color="#06b6d4" />
            <StatCard icon="bi-person-badge-fill" label="Active Trainers" value={report?.totalTrainers} color="#10b981" />
            <StatCard icon="bi-journal-check" label="Total Enrollments" value={report?.totalEnrollments} color="#f59e0b" />
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="card table-card">
                <div className="card-header bg-white border-0 pt-3 pb-0">
                  <h6 className="fw-bold mb-0">Platform Overview</h6>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      <span className="text-muted">Pending Trainer Requests</span>
                      <span className="fw-semibold">{report?.pendingTrainerRequests ?? 0}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span className="text-muted">Total Feedback</span>
                      <span className="fw-semibold">{report?.totalFeedback ?? 0}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span className="text-muted">Average Rating</span>
                      <span className="fw-semibold">{report?.averageRating ? report.averageRating.toFixed(1) : '—'} ⭐</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card table-card h-100 p-3">
                <h6 className="fw-bold mb-3">Quick Actions</h6>
                <div className="d-grid gap-2">
                  <a href="/admin/trainer-requests" className="btn btn-outline-primary btn-sm text-start">
                    <i className="bi bi-person-check me-2" />Review Trainer Requests
                  </a>
                  <a href="/admin/users" className="btn btn-outline-secondary btn-sm text-start">
                    <i className="bi bi-people me-2" />Manage Users
                  </a>
                  <a href="/admin/courses" className="btn btn-outline-info btn-sm text-start">
                    <i className="bi bi-collection me-2" />View All Courses
                  </a>
                  <a href="/admin/feedback" className="btn btn-outline-warning btn-sm text-start">
                    <i className="bi bi-chat-dots me-2" />Moderate Feedback
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}

export default AdminDashboard
