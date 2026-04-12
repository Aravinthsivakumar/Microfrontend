import { useEffect, useState } from 'react'
import Layout from '../../components/common/Layout'
import { trainerAPI } from '../../api/services'
import { Spinner } from '../../components/common/UI'

const TrainerStudents = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    trainerAPI.getStudents()
      .then(({ data }) => setStudents(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = students.filter((s) =>
    `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout title="My Students">
      <div className="card table-card">
        <div className="card-header bg-white border-0 pt-3 d-flex justify-content-between align-items-center">
          <h6 className="fw-bold mb-0">Enrolled Students <span className="text-muted fw-normal">({students.length})</span></h6>
          <input
            className="form-control form-control-sm"
            style={{ width: 220 }}
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="card-body p-0">
          {loading ? <Spinner /> : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr><th>#</th><th>Student</th><th>Email</th></tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={3} className="text-center text-muted py-4">No students yet.</td></tr>
                  ) : filtered.map((s, i) => (
                    <tr key={s.id || i}>
                      <td className="text-muted">{i + 1}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div style={{
                            width: 34, height: 34, borderRadius: '50%',
                            background: 'linear-gradient(135deg,#818cf8,#06b6d4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 700, fontSize: '0.75rem'
                          }}>
                            {s.firstName?.[0]}{s.lastName?.[0]}
                          </div>
                          <span className="fw-semibold">{s.firstName} {s.lastName}</span>
                        </div>
                      </td>
                      <td className="text-muted">{s.email}</td>
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

export default TrainerStudents
