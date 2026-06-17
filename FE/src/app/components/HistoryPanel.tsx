import { HistoryEntry } from '../App';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onSelectEntry: (entry: HistoryEntry) => void;
  currentJobId?: string;
}

const VERDICT_STYLE = {
  HIGH: { color: 'var(--c-red)', label: 'CAO', dot: '#e05757' },
  MEDIUM: { color: '#e8a838', label: 'TB', dot: '#e8a838' },
  LOW: { color: 'var(--c-green)', label: 'THẤP', dot: '#44c98a' },
};

export function HistoryPanel({ history, onSelectEntry, currentJobId }: HistoryPanelProps) {
  if (history.length === 0) return null;

  return (
    <div className="c-history-panel">
      <div className="c-history-header">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
          <circle cx="8" cy="8" r="6" />
          <path d="M8 5v3l2 2" strokeLinecap="round" />
        </svg>
        Lịch sử kiểm tra
        <span className="c-history-count">{history.length}</span>
      </div>

      <div className="c-history-list">
        {history.map((entry) => {
          const vs = VERDICT_STYLE[entry.verdict ?? 'LOW'] || VERDICT_STYLE.LOW;
          const isActive = entry.job_id === currentJobId;

          return (
            <button
              key={entry.job_id}
              className={`c-history-item ${isActive ? 'c-history-item--active' : ''}`}
              onClick={() => onSelectEntry(entry)}
            >
              <div className="c-history-item-left">
                <span className="c-history-dot" style={{ background: vs.dot }} />
              </div>
              <div className="c-history-item-body">
                <div className="c-history-item-name">{entry.fileName}</div>
                <div className="c-history-item-meta">
                  <span style={{ color: vs.color }}>{vs.label}</span>
                  <span>·</span>
                  <span>{entry.matches_found ?? 0} đoạn</span>
                  <span>·</span>
                  <span>{entry.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              <div className="c-history-item-score" style={{ color: vs.color }}>
                {((entry.max_score ?? 0) * 100).toFixed(0)}%
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
