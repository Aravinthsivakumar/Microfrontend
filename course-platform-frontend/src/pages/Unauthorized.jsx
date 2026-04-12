import { useNavigate } from 'react-router-dom'

const Unauthorized = () => {
  const navigate = useNavigate()
  return (
    <div className="auth-wrapper">
      <div className="text-center text-white">
        <div style={{ fontSize: '5rem' }}>🔒</div>
        <h2 className="fw-bold mt-3">Access Denied</h2>
        <p className="opacity-75">You don&apos;t have permission to view this page.</p>
        <button className="btn btn-light px-4 mt-2" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  )
}

export default Unauthorized
