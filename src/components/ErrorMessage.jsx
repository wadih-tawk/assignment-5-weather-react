export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="status status-error">
      <p className="status-message">{message}</p>
      {onRetry && (
        <button className="button button-outline" type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
