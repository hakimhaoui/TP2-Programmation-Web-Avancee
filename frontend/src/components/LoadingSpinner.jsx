export default function LoadingSpinner({ label = 'Chargement…' }) {
  return (
    <div className="loading-wrap text-center py-5" role="status" aria-live="polite">
      <div className="spinner-border text-success" aria-hidden="true" />
      <p className="mt-3 mb-0 text-muted">{label}</p>
    </div>
  );
}
