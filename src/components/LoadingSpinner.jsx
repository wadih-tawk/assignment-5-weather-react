export default function LoadingSpinner({ message }) {
  return (
    <div className="status status-loading">
      <span className="spinner" aria-hidden="true" />
      <p className="status-message">{message}</p>
    </div>
  );
}
