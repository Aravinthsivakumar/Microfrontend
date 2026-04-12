import { useEffect, useState } from 'react'
import Layout from '../../components/common/Layout'
import { adminAPI } from '../../api/services'
import { Spinner, StatusBadge } from '../../components/common/UI'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    adminAPI.getAllUsers()
      .then(({ data }) => setUsers(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout title="Manage Users">
      <div className="card table-card">
        <div className="card-header bg-white border-0 pt-3 d-flex justify-content-between align-items-center">
          <h6 className="fw-bold mb-0">All Users <span className="text-muted fw-normal">({users.length})</span></h6>
          <input
            className="form-control form-control-sm"
            style={{ width: 220 }}
            placeholder="Search by name or email..."
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
                    <th>Name</th>
                    <th>Email</th>
                    <th>Roles</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="text-center text-muted py-4">No users found.</td></tr>
                  ) : filtered.map((u, i) => (
                    <tr key={u.id}>
                      <td className="text-muted">{i + 1}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'linear-gradient(135deg,#818cf8,#06b6d4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 700, fontSize: '0.75rem'
                          }}>
                            {u.firstName?.[0]}{u.lastName?.[0]}
                          </div>
                          <span className="fw-semibold">{u.firstName} {u.lastName}</span>
                        </div>
                      </td>
                      <td className="text-muted">{u.email}</td>
                      <td>
                        {u.roles?.map((r) => (
                          <span key={r} className="badge bg-light text-dark me-1" style={{ fontSize: '0.72rem' }}>
                            {r.replace('ROLE_', '')}
                          </span>
                        ))}
                      </td>
                      <td>
                        <StatusBadge status={u.active ? 'ACTIVE' : 'INACTIVE'} />
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

export default AdminUsers
