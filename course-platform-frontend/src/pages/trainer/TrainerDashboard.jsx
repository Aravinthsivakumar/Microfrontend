import { useEffect, useState } from 'react'
import Layout from '../../components/common/Layout'
import { trainerAPI } from '../../api/services'
import { Spinner, StatusBadge } from '../../components/common/UI'

const TrainerDashboard = () => {
  const [courses, setCourses] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([trainerAPI.getMyCourses(), trainerAPI.getCourseRequests()])
      .then(([c, r]) => { setCourses(c.data); setRequests(r.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const pendingRequests = requests.filter((r) => r.status === 'PENDING')

  return (
    <Layout title="Trainer Dashboard">
      {loading ? <Spinner /> : (
        <>
          <div className="row g-3 mb-4">
            {[
              { label: 'My Courses', value: courses.length, icon: 'bi-collection-fill', color: '#4f46e5' },
              { label: 'Pending Requests', value: pendingRequests.length, icon: 'bi-inbox-fill', color: '#f59e0b' },
              { label: 'Total Requests', value: requests.length, icon: 'bi-send-fill', color: '#06b6d4' },
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
                <div className="card-header bg-white border-0 pt-3">
                  <h6 className="fw-bold mb-0">My Courses</h6>
                </div>
                <div className="card-body p-0">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr><th>Title</th><th>Category</th><th>Price</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {courses.length === 0 ? (
                        <tr><td colSpan={4} className="text-center text-muted py-3">No courses yet.</td></tr>
                      ) : courses.slice(0, 5).map((c) => (
                        <tr key={c.id}>
                          <td className="fw-semibold">{c.title}</td>
                          <td><span className="badge bg-light text-dark">{c.category || '—'}</span></td>
                          <td className="text-success">{c.price ? `₹${c.price}` : 'Free'}</td>
                          <td><StatusBadge status={c.status || 'ACTIVE'} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card table-card">
                <div className="card-header bg-white border-0 pt-3">
                  <h6 className="fw-bold mb-0">Pending Student Requests</h6>
                </div>
                <div className="card-body p-0">
                  <table className="table mb-0">
                    <thead><tr><th>Student</th><th>Course</th><th>Status</th></tr></thead>
                    <tbody>
                      {pendingRequests.length === 0 ? (
                        <tr><td colSpan={3} className="text-center text-muted py-3">No pending requests.</td></tr>
                      ) : pendingRequests.slice(0, 5).map((r) => (
                        <tr key={r.id}>
                          <td style={{ fontSize: '0.85rem' }}>{r.userName || r.userEmail || '—'}</td>
                          <td style={{ fontSize: '0.85rem' }}>{r.courseTitle || '—'}</td>
                          <td><StatusBadge status={r.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}

export default TrainerDashboard
