import { useEffect, useState } from 'react'
import Layout from '../../components/common/Layout'
import { userAPI } from '../../api/services'
import { Spinner, StatusBadge } from '../../components/common/UI'

const UserRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    userAPI.getMyCourseRequests()
      .then(({ data }) => setRequests(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'ALL' ? requests : requests.filter((r) => r.status === filter)

  return (
    <Layout title="My Course Requests">
      <div className="d-flex gap-2 mb-3">
        {['ALL', 'PENDING', 'ACCEPTED', 'DECLINED'].map((f) => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter(f)}>
            {f}
            <span className="badge bg-white text-dark ms-1">
              {f === 'ALL' ? requests.length : requests.filter(r => r.status === f).length}
            </span>
          </button>
        ))}
      </div>

      <div className="card table-card">
        <div className="card-body p-0">
          {loading ? <Spinner /> : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr><th>#</th><th>Course</th><th>Trainer</th><th>Message Sent</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-4">
                        No requests found. <a href="/user/courses">Browse courses</a> to send a request.
                      </td>
                    </tr>
                  ) : filtered.map((r, i) => (
                    <tr key={r.id}>
                      <td className="text-muted">{i + 1}</td>
                      <td className="fw-semibold">{r.courseTitle || '—'}</td>
                      <td className="text-muted">{r.trainerName || '—'}</td>
                      <td className="text-muted" style={{ fontSize: '0.82rem' }}>{r.message || '—'}</td>
                      <td><StatusBadge status={r.status} /></td>
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

export default UserRequests
