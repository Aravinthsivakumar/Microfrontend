import { useEffect, useState } from 'react'
import Layout from '../../components/common/Layout'
import { adminAPI } from '../../api/services'
import { Spinner, StatusBadge, Alert } from '../../components/common/UI'

const AdminTrainerRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [filter, setFilter] = useState('ALL')
  const [reason, setReason] = useState('')
  const [selected, setSelected] = useState(null)

  const fetchRequests = () => {
    setLoading(true)
    adminAPI.getAllTrainerRequests()
      .then(({ data }) => setRequests(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchRequests() }, [])

  const decide = async (id, approved) => {
    setActionLoading(id)
    setMessage({ type: '', text: '' })
    try {
      await adminAPI.decideTrainerRequest(id, { approved, reason })
      setMessage({ type: 'success', text: `Request ${approved ? 'approved' : 'rejected'} successfully.` })
      setReason('')
      setSelected(null)
      fetchRequests()
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Action failed.' })
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = filter === 'ALL' ? requests : requests.filter((r) => r.status === filter)

  return (
    <Layout title="Trainer Requests">
      <Alert type={message.type} message={message.text} />

      <div className="d-flex gap-2 mb-3">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="card table-card">
        <div className="card-body p-0">
          {loading ? <Spinner /> : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Specialization</th>
                    <th>Bio</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="text-center text-muted py-4">No requests found.</td></tr>
                  ) : filtered.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <div className="fw-semibold">{r.userName || r.userEmail}</div>
                        <div className="text-muted" style={{ fontSize: '0.78rem' }}>{r.userEmail}</div>
                      </td>
                      <td>{r.specialization || '—'}</td>
                      <td style={{ maxWidth: 200 }}>
                        <div className="text-muted" style={{ fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.bio || '—'}
                        </div>
                      </td>
                      <td><StatusBadge status={r.status} /></td>
                      <td>
                        {r.status === 'PENDING' && (
                          <div className="d-flex gap-2">
                            {selected === r.id ? (
                              <div className="d-flex gap-2 align-items-center">
                                <input
                                  className="form-control form-control-sm"
                                  style={{ width: 140 }}
                                  placeholder="Reason (optional)"
                                  value={reason}
                                  onChange={(e) => setReason(e.target.value)}
                                />
                                <button
                                  className="btn btn-success btn-sm"
                                  disabled={actionLoading === r.id}
                                  onClick={() => decide(r.id, true)}
                                >
                                  <i className="bi bi-check-lg" /> Approve
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  disabled={actionLoading === r.id}
                                  onClick={() => decide(r.id, false)}
                                >
                                  <i className="bi bi-x-lg" /> Reject
                                </button>
                                <button className="btn btn-sm btn-light" onClick={() => setSelected(null)}>Cancel</button>
                              </div>
                            ) : (
                              <button className="btn btn-sm btn-outline-primary" onClick={() => setSelected(r.id)}>
                                Review
                              </button>
                            )}
                          </div>
                        )}
                        {r.status !== 'PENDING' && (
                          <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                            {r.adminReason || 'No reason given'}
                          </span>
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

export default AdminTrainerRequests
