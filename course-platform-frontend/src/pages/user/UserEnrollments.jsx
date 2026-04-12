import { useEffect, useState } from 'react'
import Layout from '../../components/common/Layout'
import { userAPI } from '../../api/services'
import { Spinner, StatusBadge } from '../../components/common/UI'

const UserEnrollments = () => {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    userAPI.getEnrolledCourses()
      .then(({ data }) => setEnrollments(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout title="My Enrollments">
      <div className="card table-card">
        <div className="card-header bg-white border-0 pt-3">
          <h6 className="fw-bold mb-0">Enrolled Courses <span className="text-muted fw-normal">({enrollments.length})</span></h6>
        </div>
        <div className="card-body p-0">
          {loading ? <Spinner /> : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr><th>#</th><th>Course</th><th>Trainer</th><th>Enrolled On</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {enrollments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-5 text-muted">
                        <i className="bi bi-journal-x display-6 d-block mb-2" />
                        No enrollments yet. <a href="/user/courses" className="text-decoration-none">Browse courses</a> to get started!
                      </td>
                    </tr>
                  ) : enrollments.map((e, i) => (
                    <tr key={e.id}>
                      <td className="text-muted">{i + 1}</td>
                      <td>
                        <div className="fw-semibold">{e.courseTitle || '—'}</div>
                        <div className="text-muted" style={{ fontSize: '0.78rem' }}>{e.courseCategory || ''}</div>
                      </td>
                      <td className="text-muted">{e.trainerName || '—'}</td>
                      <td className="text-muted" style={{ fontSize: '0.83rem' }}>
                        {e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : '—'}
                      </td>
                      <td><StatusBadge status={e.status || 'ACTIVE'} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default UserEnrollments
