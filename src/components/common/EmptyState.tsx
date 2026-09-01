export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ title, description, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <div className="empty-state" role="status">
      <p className="empty-state__title">{title}</p>
      {description ? (
        <p className="empty-state__description">{description}</p>
      ) : null}
      {actionLabel && onAction ? (
        <div className="empty-state__action">
          <button className="btn btn--secondary btn--sm" onClick={onAction}>
            {actionLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
};
