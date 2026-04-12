import { useEffect, useState } from 'react'
import Layout from '../../components/common/Layout'
import { trainerAPI } from '../../api/services'
import { Spinner, Alert, StatusBadge } from '../../components/common/UI'

const TrainerRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [actionLoading, setActionLoading] = useState(null)
  const [filter, setFilter] = useState('ALL')

  const fetchRequests = () => {
    setLoading(true)
    trainerAPI.getCourseRequests()
      .then(({ data }) => setRequests(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchRequests() }, [])

  const decide = async (id, accepted) => {
    setActionLoading(id)
    try {
      await trainerAPI.decideCourseRequest(id, { accepted })
      setMessage({ type: 'success', text: `Request ${accepted ? 'accepted' : 'declined'}.` })
      fetchRequests()
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Action failed.' })
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = filter === 'ALL' ? requests : requests.filter((r) => r.status === filter)

  return (
    <Layout title="Course Enrollment Requests">
      <Alert type={message.type} message={message.text} />

      <div className="d-flex gap-2 mb-3">
        {['ALL', 'PENDING', 'ACCEPTED', 'DECLINED'].map((f) => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter(f)}>
            {f} {f !== 'ALL' && <span className="badge bg-white text-dark ms-1">{requests.filter(r => r.status === f).length}</span>}
          </button>
        ))}
      </div>

      <div className="card table-card">
        <div className="card-body p-0">
          {loading ? <Spinner /> : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr><th>Student</th><th>Course</th><th>Message</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="text-center text-muted py-4">No requests found.</td></tr>
                  ) : filtered.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <div className="fw-semibold">{r.userName || '—'}</div>
                        <div className="text-muted" style={{ fontSize: '0.78rem' }}>{r.userEmail}</div>
                      </td>
                      <td className="fw-semibold text-primary">{r.courseTitle || '—'}</td>
                      <td>
                        <span className="text-muted" style={{ fontSize: '0.83rem' }}>{r.message || 'No message'}</span>
                      </td>
                      <td><StatusBadge status={r.status} /></td>
                      <td>
                        {r.status === 'PENDING' ? (
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-success btn-sm"
                              disabled={actionLoading === r.id}
                              onClick={() => decide(r.id, true)}
                            >
                              {actionLoading === r.id ? <span className="spinner-border spinner-border-sm" /> : <><i className="bi bi-check-lg" /> Accept</>}
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              disabled={actionLoading === r.id}
                              onClick={() => decide(r.id, false)}
                            >
                              <i className="bi bi-x-lg" /> Decline
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted" style={{ fontSize: '0.8rem' }}>Decided</span>
                        )}
                      </td>
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

export default TrainerRequests
