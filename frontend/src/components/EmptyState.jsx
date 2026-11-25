export default function EmptyState({ title = 'Aucun résultat', description, action }) {
  return (
    <div className="empty-state text-center py-5 px-3 bg-white border">
      <i className="bi bi-journal-x fs-1 text-muted" aria-hidden="true" />
      <h2 className="h4 mt-3">{title}</h2>
      {description && <p className="text-muted mb-3">{description}</p>}
      {action}
    </div>
  );
}
