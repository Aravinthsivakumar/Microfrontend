import { useEffect, useState } from 'react'
import Layout from '../../components/common/Layout'
import { courseAPI, userAPI } from '../../api/services'
import { Spinner, Alert, StarRating } from '../../components/common/UI'

const BrowseCourses = () => {
  const [courses, setCourses] = useState([])
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Enroll modal state
  const [enrollModal, setEnrollModal] = useState(null)
  const [enrollMessage, setEnrollMessage] = useState('')
  const [enrolling, setEnrolling] = useState(false)

  // Feedback modal state
  const [fbModal, setFbModal] = useState(null)
  const [fbForm, setFbForm] = useState({ rating: 5, comment: '' })
  const [submittingFb, setSubmittingFb] = useState(false)

  const search = (kw = keyword) => {
    setLoading(true)
    setMessage({ type: '', text: '' })
    courseAPI.search(kw)
      .then(({ data }) => setCourses(data))
      .catch(() => setMessage({ type: 'danger', text: 'Failed to load courses.' }))
      .finally(() => setLoading(false))
  }

  useEffect(() => { search('') }, [])

  const handleEnroll = async () => {
    setEnrolling(true)
    try {
      await userAPI.sendCourseRequest({ courseId: enrollModal.id, message: enrollMessage })
      setMessage({ type: 'success', text: `Enrollment request sent for "${enrollModal.title}"!` })
      setEnrollModal(null)
      setEnrollMessage('')
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Enrollment failed.' })
    } finally {
      setEnrolling(false)
    }
  }

  const handleFeedback = async () => {
    setSubmittingFb(true)
    try {
      await userAPI.submitFeedback({ courseId: fbModal.id, ...fbForm })
      setMessage({ type: 'success', text: 'Feedback submitted!' })
      setFbModal(null)
      setFbForm({ rating: 5, comment: '' })
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to submit feedback.' })
    } finally {
      setSubmittingFb(false)
    }
  }

  return (
    <Layout title="Browse Courses">
      <Alert type={message.type} message={message.text} />

      {/* Search bar */}
      <div className="card border-0 shadow-sm p-3 mb-4">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search text-muted" />
          </span>
          <input
            className="form-control border-start-0 border-end-0"
            placeholder="Search by title or category..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
          />
          <button className="btn btn-primary-custom px-4" onClick={() => search()}>Search</button>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div className="row g-3">
          {courses.length === 0 ? (
            <div className="col-12 text-center py-5 text-muted">
              <i className="bi bi-search display-5 d-block mb-3" />
              No courses found. Try a different keyword.
            </div>
          ) : courses.map((c) => (
            <div className="col-md-6 col-xl-4" key={c.id}>
              <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                <div style={{ height: 6, background: 'linear-gradient(90deg,#4f46e5,#06b6d4)' }} />
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-light text-dark" style={{ fontSize: '0.72rem' }}>{c.category || 'General'}</span>
                    <span className="fw-bold text-success">{c.price ? `₹${c.price}` : 'Free'}</span>
                  </div>
                  <h6 className="fw-bold mb-1">{c.title}</h6>
                  <p className="text-muted mb-3" style={{ fontSize: '0.82rem' }}>
                    {c.description?.substring(0, 90) || 'No description available.'}
                    {c.description?.length > 90 ? '...' : ''}
                  </p>
                  <div className="text-muted mb-3" style={{ fontSize: '0.78rem' }}>
                    <i className="bi bi-person me-1" />{c.trainerName || 'Trainer'}
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary-custom btn-sm flex-grow-1" onClick={() => setEnrollModal(c)}>
                      <i className="bi bi-send me-1" />Request Enroll
                    </button>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => setFbModal(c)} title="Give Feedback">
                      <i className="bi bi-star" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enroll Modal */}
      {enrollModal && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Request Enrollment</h5>
                <button className="btn-close" onClick={() => setEnrollModal(null)} />
              </div>
              <div className="modal-body">
                <p className="text-muted">You&apos;re requesting to enroll in <strong>{enrollModal.title}</strong>.</p>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Message to Trainer (optional)</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Tell the trainer why you want to join..."
                    value={enrollMessage}
                    onChange={(e) => setEnrollMessage(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-light" onClick={() => setEnrollModal(null)}>Cancel</button>
                <button className="btn btn-primary-custom" onClick={handleEnroll} disabled={enrolling}>
                  {enrolling ? <><span className="spinner-border spinner-border-sm me-2" />Sending...</> : 'Send Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {fbModal && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Submit Feedback</h5>
                <button className="btn-close" onClick={() => setFbModal(null)} />
              </div>
              <div className="modal-body">
                <p className="text-muted">Feedback for <strong>{fbModal.title}</strong></p>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Rating</label>
                  <div className="d-flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        className="btn btn-sm p-1"
                        onClick={() => setFbForm({ ...fbForm, rating: s })}
                        style={{ fontSize: '1.4rem', background: 'none', border: 'none' }}
                      >
                        <i className={`bi bi-star${s <= fbForm.rating ? '-fill' : ''} rating-star`} />
                      </button>
                    ))}
                    <span className="ms-2 align-self-center text-muted">{fbForm.rating}/5</span>
                  </div>
                </div>
                <div>
                  <label className="form-label fw-semibold">Comment <span className="text-danger">*</span></label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Share your experience..."
                    value={fbForm.comment}
                    onChange={(e) => setFbForm({ ...fbForm, comment: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-light" onClick={() => setFbModal(null)}>Cancel</button>
                <button className="btn btn-primary-custom" onClick={handleFeedback} disabled={submittingFb || !fbForm.comment.trim()}>
                  {submittingFb ? <><span className="spinner-border spinner-border-sm me-2" />Submitting...</> : 'Submit Feedback'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default BrowseCourses
