import './index.css'

const FailureView = props => {
  const {onRetry} = props

  const onClickRetry = () => {
    onRetry()
  }

  return (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/dptc4np08/image/upload/v1720015103/failure-view_fv1pso.png"
        alt="failure view"
        className="failure-image"
      />
      <p className="failure-description">
        Something went wrong. Please try again.
      </p>
      <button type="button" className="failure-button" onClick={onClickRetry}>
        Try Again
      </button>
    </div>
  )
}

export default FailureView
