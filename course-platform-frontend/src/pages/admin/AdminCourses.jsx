import { useEffect, useState } from 'react'
import Layout from '../../components/common/Layout'
import { adminAPI } from '../../api/services'
import { Spinner, StatusBadge } from '../../components/common/UI'

const AdminCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    adminAPI.getAllCourses()
      .then(({ data }) => setCourses(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = courses.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout title="All Courses">
      <div className="card table-card">
        <div className="card-header bg-white border-0 pt-3 d-flex justify-content-between align-items-center">
          <h6 className="fw-bold mb-0">Courses <span className="text-muted fw-normal">({courses.length})</span></h6>
          <input
            className="form-control form-control-sm"
            style={{ width: 220 }}
            placeholder="Search title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="card-body p-0">
          {loading ? <Spinner /> : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Trainer</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-muted py-4">No courses found.</td></tr>
                  ) : filtered.map((c, i) => (
                    <tr key={c.id}>
                      <td className="text-muted">{i + 1}</td>
                      <td>
                        <div className="fw-semibold">{c.title}</div>
                        <div className="text-muted" style={{ fontSize: '0.78rem' }}>{c.description?.substring(0, 60)}...</div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">{c.category || '—'}</span>
                      </td>
                      <td className="text-muted">{c.trainerName || '—'}</td>
                      <td className="fw-semibold text-success">
                        {c.price ? `₹${c.price}` : 'Free'}
                      </td>
                      <td><StatusBadge status={c.status || 'ACTIVE'} /></td>
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

export default AdminCourses
