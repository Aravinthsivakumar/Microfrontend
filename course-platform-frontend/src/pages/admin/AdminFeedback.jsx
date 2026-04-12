import { useEffect, useState } from 'react'
import Layout from '../../components/common/Layout'
import { adminAPI } from '../../api/services'
import { Spinner, Alert, StarRating } from '../../components/common/UI'

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [deleting, setDeleting] = useState(null)

  const fetchFeedback = () => {
    setLoading(true)
    adminAPI.getAllFeedback()
      .then(({ data }) => setFeedback(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchFeedback() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback?')) return
    setDeleting(id)
    try {
      await adminAPI.deleteFeedback(id)
      setMessage({ type: 'success', text: 'Feedback deleted.' })
      fetchFeedback()
    } catch {
      setMessage({ type: 'danger', text: 'Failed to delete feedback.' })
    } finally {
      setDeleting(null)
    }
  }

  return (
    <Layout title="Moderate Feedback">
      <Alert type={message.type} message={message.text} />
      <div className="card table-card">
        <div className="card-header bg-white border-0 pt-3">
          <h6 className="fw-bold mb-0">All Feedback <span className="text-muted fw-normal">({feedback.length})</span></h6>
        </div>
        <div className="card-body p-0">
          {loading ? <Spinner /> : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Course</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {feedback.length === 0 ? (
                    <tr><td colSpan={5} className="text-center text-muted py-4">No feedback yet.</td></tr>
                  ) : feedback.map((f) => (
                    <tr key={f.id}>
                      <td className="fw-semibold">{f.userName || f.userEmail || '—'}</td>
                      <td className="text-muted">{f.courseTitle || '—'}</td>
                      <td><StarRating rating={f.rating} /></td>
                      <td style={{ maxWidth: 260 }}>
                        <span style={{ fontSize: '0.85rem' }}>{f.comment}</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(f.id)}
                          disabled={deleting === f.id}
                        >
                          {deleting === f.id ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-trash" />}
                        </button>
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

export default AdminFeedback
