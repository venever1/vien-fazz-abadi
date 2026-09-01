interface ProgressBarProps {
  progress: number; // 0 to 100
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  const clamped = Math.min(100, Math.max(0, progress));
  const isComplete = clamped >= 100;

  return (
    <div className="progress-bar">
      <div className="progress-bar__track">
        <div
          className={`progress-bar__fill ${isComplete ? 'progress-bar__fill--ok' : 'progress-bar__fill--amber'}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="progress-bar__text">{clamped.toFixed(0)}% terbayar</span>
    </div>
  );
};
