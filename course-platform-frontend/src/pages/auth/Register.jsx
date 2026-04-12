import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../../api/services'

const Register = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (form.password.length < 8 || form.password.length > 16) {
      setError('Password must be 8–16 characters.')
      return
    }
    setLoading(true)
    try {
      await authAPI.register(form)
      setSuccess('Registration successful! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1800)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <i className="bi bi-person-plus-fill" />
        </div>
        <h4 className="text-center fw-bold mb-1">Create Account</h4>
        <p className="text-center text-muted mb-4" style={{ fontSize: '0.88rem' }}>
          Join the platform today
        </p>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>First Name</label>
              <input type="text" name="firstName" className="form-control" placeholder="John" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="col-6">
              <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>Last Name</label>
              <input type="text" name="lastName" className="form-control" placeholder="Doe" value={form.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>Email Address</label>
            <input type="email" name="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>Password <span className="text-muted fw-normal">(8–16 chars)</span></label>
            <input type="password" name="password" className="form-control" placeholder="••••••••" value={form.password} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-primary-custom w-100" disabled={loading}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2" />Registering...</> : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-4 mb-0" style={{ fontSize: '0.88rem' }}>
          Already have an account?{' '}
          <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: '#4f46e5' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
