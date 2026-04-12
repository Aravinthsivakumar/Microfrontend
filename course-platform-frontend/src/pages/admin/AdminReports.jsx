import { useEffect, useState } from 'react'
import Layout from '../../components/common/Layout'
import { adminAPI } from '../../api/services'
import { Spinner } from '../../components/common/UI'

const MetricRow = ({ label, value, icon, color }) => (
  <div className="d-flex align-items-center justify-content-between py-3 border-bottom">
    <div className="d-flex align-items-center gap-3">
      <div style={{
        width: 38, height: 38, borderRadius: '0.6rem',
        background: `${color}20`, color, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <i className={`bi ${icon}`} />
      </div>
      <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>{label}</span>
    </div>
    <span className="fw-bold fs-5">{value ?? '—'}</span>
  </div>
)

const AdminReports = () => {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.getReport()
      .then(({ data }) => setReport(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout title="Platform Reports">
      {loading ? <Spinner /> : (
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card table-card p-4">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-bar-chart-line me-2 text-primary" />Platform Statistics
              </h6>
              <MetricRow label="Total Users" value={report?.totalUsers} icon="bi-people-fill" color="#4f46e5" />
              <MetricRow label="Total Trainers" value={report?.totalTrainers} icon="bi-person-badge-fill" color="#10b981" />
              <MetricRow label="Total Courses" value={report?.totalCourses} icon="bi-collection-fill" color="#06b6d4" />
              <MetricRow label="Total Enrollments" value={report?.totalEnrollments} icon="bi-journal-check" color="#f59e0b" />
              <MetricRow label="Total Feedback" value={report?.totalFeedback} icon="bi-chat-dots-fill" color="#8b5cf6" />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card table-card p-4">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-clipboard-data me-2 text-success" />Quality Metrics
              </h6>
              <MetricRow label="Pending Trainer Requests" value={report?.pendingTrainerRequests} icon="bi-hourglass-split" color="#f59e0b" />
              <MetricRow label="Average Course Rating" value={report?.averageRating ? `${report.averageRating.toFixed(2)} ⭐` : '—'} icon="bi-star-fill" color="#f59e0b" />
              <div className="mt-4 p-3 rounded" style={{ background: '#f0fdf4' }}>
                <div className="text-success fw-semibold mb-1"><i className="bi bi-info-circle me-1" />Summary</div>
                <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                  The platform has <strong>{report?.totalUsers}</strong> registered users, <strong>{report?.totalTrainers}</strong> active trainers,
                  and <strong>{report?.totalCourses}</strong> courses with <strong>{report?.totalEnrollments}</strong> total enrollments.
                  Average rating across all courses is <strong>{report?.averageRating?.toFixed(2) ?? 'N/A'}</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default AdminReports
