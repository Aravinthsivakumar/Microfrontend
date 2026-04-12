import { useEffect, useState } from 'react'
import Layout from '../../components/common/Layout'
import { trainerAPI } from '../../api/services'
import { Spinner, Alert, StatusBadge } from '../../components/common/UI'

const emptyForm = { title: '', description: '', category: '', price: '', status: 'ACTIVE' }

const TrainerCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showModal, setShowModal] = useState(false)

  const fetchCourses = () => {
    setLoading(true)
    trainerAPI.getMyCourses()
      .then(({ data }) => setCourses(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCourses() }, [])

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowModal(true) }
  const openEdit = (c) => {
    setForm({ title: c.title, description: c.description || '', category: c.category || '', price: c.price || '', status: c.status || 'ACTIVE' })
    setEditId(c.id)
    setShowModal(true)
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = async () => {
    if (!form.title.trim()) { setMessage({ type: 'danger', text: 'Title is required.' }); return }
    setSaving(true)
    setMessage({ type: '', text: '' })
    try {
      if (editId) await trainerAPI.updateCourse(editId, form)
      else await trainerAPI.createCourse(form)
      setMessage({ type: 'success', text: `Course ${editId ? 'updated' : 'created'} successfully!` })
      setShowModal(false)
      fetchCourses()
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to save course.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout title="My Courses">
      <Alert type={message.type} message={message.text} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted">{courses.length} course(s)</span>
        <button className="btn btn-primary-custom" onClick={openCreate}>
          <i className="bi bi-plus-lg me-2" />New Course
        </button>
      </div>

      <div className="card table-card">
        <div className="card-body p-0">
          {loading ? <Spinner /> : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr><th>Title</th><th>Category</th><th>Price</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {courses.length === 0 ? (
                    <tr><td colSpan={5} className="text-center text-muted py-5">
                      <i className="bi bi-collection display-6 d-block mb-2 text-muted" />
                      No courses yet. Create your first course!
                    </td></tr>
                  ) : courses.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div className="fw-semibold">{c.title}</div>
                        <div className="text-muted" style={{ fontSize: '0.78rem' }}>{c.description?.substring(0, 50)}...</div>
                      </td>
                      <td><span className="badge bg-light text-dark">{c.category || '—'}</span></td>
                      <td className="text-success fw-semibold">{c.price ? `₹${c.price}` : 'Free'}</td>
                      <td><StatusBadge status={c.status || 'ACTIVE'} /></td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(c)}>
                          <i className="bi bi-pencil" /> Edit
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

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">{editId ? 'Edit Course' : 'Create New Course'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Title <span className="text-danger">*</span></label>
                  <input name="title" className="form-control" value={form.title} onChange={handleChange} placeholder="e.g. React for Beginners" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea name="description" className="form-control" rows={3} value={form.description} onChange={handleChange} placeholder="Course description..." />
                </div>
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label fw-semibold">Category</label>
                    <input name="category" className="form-control" value={form.category} onChange={handleChange} placeholder="e.g. Web Development" />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold">Price (₹)</label>
                    <input name="price" type="number" min="0" className="form-control" value={form.price} onChange={handleChange} placeholder="0 for free" />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="form-label fw-semibold">Status</label>
                  <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary-custom" onClick={handleSave} disabled={saving}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : 'Save Course'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default TrainerCourses
