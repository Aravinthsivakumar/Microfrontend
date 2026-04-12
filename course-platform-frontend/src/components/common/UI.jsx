export const Spinner = () => (
  <div className="d-flex justify-content-center align-items-center py-5">
    <div className="spinner-border text-primary" />
  </div>
)

export const Alert = ({ type = 'danger', message }) =>
  message ? (
    <div className={`alert alert-${type} d-flex align-items-center gap-2`} role="alert">
      <i className={`bi ${type === 'danger' ? 'bi-exclamation-triangle' : 'bi-check-circle'}`} />
      {message}
    </div>
  ) : null

export const StatusBadge = ({ status }) => {
  const map = {
    PENDING: 'badge-pending',
    APPROVED: 'badge-approved',
    REJECTED: 'badge-rejected',
    ACTIVE: 'badge-active',
    INACTIVE: 'bg-secondary text-white',
    ACCEPTED: 'badge-approved',
    DECLINED: 'badge-rejected',
  }
  return (
    <span className={`badge rounded-pill px-3 py-1 ${map[status] || 'bg-light text-dark'}`} style={{ fontSize: '0.75rem' }}>
      {status}
    </span>
  )
}

export const StarRating = ({ rating }) => (
  <span>
    {[1, 2, 3, 4, 5].map((s) => (
      <i key={s} className={`bi bi-star${s <= rating ? '-fill' : ''} rating-star`} />
    ))}
  </span>
)
