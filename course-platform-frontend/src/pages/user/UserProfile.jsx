import { useEffect, useState } from 'react'
import Layout from '../../components/common/Layout'
import { userAPI } from '../../api/services'
import { Spinner, Alert } from '../../components/common/UI'
import { useAuth } from '../../context/AuthContext'

const UserProfile = () => {
  const { user: authUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Trainer upgrade
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [upgradeForm, setUpgradeForm] = useState({ bio: '', specialization: '' })
  const [certificate, setCertificate] = useState(null)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    userAPI.getProfile()
      .then(({ data }) => {
        setProfile(data)
        setForm({ firstName: data.firstName, lastName: data.lastName })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleUpdate = async () => {
    setSaving(true)
    setMessage({ type: '', text: '' })
    try {
      const { data } = await userAPI.updateProfile(form)
      setProfile(data)
      setEditing(false)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Update failed.' })
    } finally {
      setSaving(false)
    }
  }

  const handleUpgrade = async () => {
    if (!certificate) { setMessage({ type: 'danger', text: 'Certificate file is required.' }); return }
    setUpgrading(true)
    setMessage({ type: '', text: '' })
    try {
      const fd = new FormData()
      fd.append('data', new Blob([JSON.stringify(upgradeForm)], { type: 'application/json' }))
      fd.append('certificate', certificate)
      await userAPI.requestTrainerUpgrade(fd)
      setMessage({ type: 'success', text: 'Trainer upgrade request submitted! Awaiting admin review.' })
      setShowUpgrade(false)
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Request failed.' })
    } finally {
      setUpgrading(false)
    }
  }

  const isTrainer = authUser?.roles?.includes('ROLE_TRAINER')

  return (
    <Layout title="My Profile">
      {loading ? <Spinner /> : (
        <>
          <Alert type={message.type} message={message.text} />
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm text-center p-4" style={{ borderRadius: '1rem' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%', margin: '0 auto 1rem',
                  background: 'linear-gradient(135deg,#4f46e5,#06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', color: '#fff', fontWeight: 700
                }}>
                  {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                </div>
                <h5 className="fw-bold mb-1">{profile?.firstName} {profile?.lastName}</h5>
                <div className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>{profile?.email}</div>
                <div className="d-flex flex-wrap gap-1 justify-content-center">
                  {authUser?.roles?.map((r) => (
                    <span key={r} className="badge rounded-pill px-3" style={{ background: '#ede9fe', color: '#5b21b6', fontSize: '0.75rem' }}>
                      {r.replace('ROLE_', '')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '1rem' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">Personal Information</h6>
                  {!editing && (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => setEditing(true)}>
                      <i className="bi bi-pencil me-1" />Edit
                    </button>
                  )}
                </div>

                {editing ? (
                  <>
                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <label className="form-label fw-semibold">First Name</label>
                        <input className="form-control" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">Last Name</label>
                        <input className="form-control" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-primary-custom btn-sm" onClick={handleUpdate} disabled={saving}>
                        {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : 'Save Changes'}
                      </button>
                      <button className="btn btn-light btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <div className="row g-3">
                    {[
                      { label: 'First Name', value: profile?.firstName },
                      { label: 'Last Name', value: profile?.lastName },
                      { label: 'Email', value: profile?.email },
                    ].map(({ label, value }) => (
                      <div className="col-md-6" key={label}>
                        <div className="text-muted" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                        <div className="fw-semibold">{value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Trainer Upgrade section */}
              {!isTrainer && (
                <div className="card border-0 shadow-sm p-4 mt-3" style={{ borderRadius: '1rem' }}>
                  <h6 className="fw-bold mb-1">Become a Trainer</h6>
                  <p className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
                    Submit your specialization and certificate to apply for a trainer role. Admin will review your request.
                  </p>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => setShowUpgrade(true)}>
                    <i className="bi bi-mortarboard me-2" />Apply for Trainer Role
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Trainer Upgrade Modal */}
          {showUpgrade && (
            <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                  <div className="modal-header border-0">
                    <h5 className="modal-title fw-bold">Request Trainer Upgrade</h5>
                    <button className="btn-close" onClick={() => setShowUpgrade(false)} />
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Specialization</label>
                      <input className="form-control" placeholder="e.g. Machine Learning, Web Development" value={upgradeForm.specialization} onChange={(e) => setUpgradeForm({ ...upgradeForm, specialization: e.target.value })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Bio</label>
                      <textarea className="form-control" rows={3} placeholder="Tell us about your teaching experience..." value={upgradeForm.bio} onChange={(e) => setUpgradeForm({ ...upgradeForm, bio: e.target.value })} />
                    </div>
                    <div>
                      <label className="form-label fw-semibold">Certificate <span className="text-danger">*</span></label>
                      <input type="file" className="form-control" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setCertificate(e.target.files[0])} />
                      <div className="form-text">PDF, JPG, or PNG. Max 5MB.</div>
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button className="btn btn-light" onClick={() => setShowUpgrade(false)}>Cancel</button>
                    <button className="btn btn-primary-custom" onClick={handleUpgrade} disabled={upgrading}>
                      {upgrading ? <><span className="spinner-border spinner-border-sm me-2" />Submitting...</> : 'Submit Request'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  )
}

export default UserProfile
