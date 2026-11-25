export default function ErrorAlert({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="alert alert-danger error-alert d-flex justify-content-between align-items-start" role="alert">
      <div>
        <strong>Erreur :</strong> {message}
      </div>
      {onClose && (
        <button type="button" className="btn-close" aria-label="Fermer" onClick={onClose} />
      )}
    </div>
  );
}
