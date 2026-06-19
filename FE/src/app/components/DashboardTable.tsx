import { useState } from 'react';
import { HistoryEntry } from '../App';

interface DashboardTableProps {
  history: HistoryEntry[];
  onSelectEntry: (entry: HistoryEntry) => void;
  onSelectProgress: (jobId: string, fileName: string, startTime: number) => void;
  onRefresh: () => Promise<void>;
  isLoading?: boolean;
}

const STATUS_BADGE = {
  queued: {
    bg: 'rgba(156, 163, 175, 0.1)',
    color: 'var(--c-text-dim)',
    label: 'Đang chờ',
    dotClass: 'bg-gray-400 animate-pulse'
  },
  running: {
    bg: 'rgba(59, 130, 246, 0.1)',
    color: 'var(--c-accent)',
    label: 'Đang quét',
    dotClass: 'bg-blue-500 c-pulsing-dot'
  },
  done: {
    bg: 'rgba(22, 163, 74, 0.1)',
    color: 'var(--c-green)',
    label: 'Hoàn thành',
    dotClass: 'bg-green-500'
  },
  failed: {
    bg: 'rgba(220, 38, 38, 0.1)',
    color: 'var(--c-red)',
    label: 'Thất bại',
    dotClass: 'bg-red-500'
  }
};

const VERDICT_STYLE = {
  HIGH: { color: 'var(--c-red)', bg: 'rgba(220, 38, 38, 0.1)', label: 'Cao' },
  MEDIUM: { color: '#d97706', bg: 'rgba(217, 119, 6, 0.1)', label: 'Trung bình' },
  LOW: { color: 'var(--c-green)', bg: 'rgba(22, 163, 74, 0.1)', label: 'Thấp' },
};

export function DashboardTable({ history, onSelectEntry, onSelectProgress, onRefresh, isLoading }: DashboardTableProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Helper to format date
  const formatDate = (date: Date) => {
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Helper to get file icon
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      return (
        <svg className="c-file-icon text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    }
    if (ext === 'docx' || ext === 'doc') {
      return (
        <svg className="c-file-icon text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      );
    }
    if (fileName === 'Manual Input' || fileName === 'Văn bản nhập tay') {
      return (
        <svg className="c-file-icon text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
        </svg>
      );
    }
    return (
      <svg className="c-file-icon text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    );
  };

  const hasRunningJobs = history.some(item => item.status === 'queued' || item.status === 'running');

  return (
    <div className="c-dashboard-container">
      {/* Dashboard Header */}
      <div className="c-dashboard-header">
        <div className="c-dashboard-title-group">
          <h2 className="c-dashboard-title">Tài liệu của bạn</h2>
          <span className="c-dashboard-count">{history.length} tài liệu</span>
          {hasRunningJobs && (
            <span className="c-live-indicator">
              <span className="c-live-dot" />
              Đang đồng bộ trực tiếp
            </span>
          )}
        </div>
        <button
          className={`c-refresh-btn ${isRefreshing || isLoading ? 'c-refresh-btn--loading' : ''}`}
          onClick={handleRefreshClick}
          disabled={isRefreshing || isLoading}
          title="Tải lại danh sách"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>
      </div>

      {/* Table Area */}
      {history.length === 0 ? (
        <div className="c-table-empty">
          <div className="c-table-empty-icon">📂</div>
          <h3 className="c-table-empty-title">Chưa có tài liệu nào</h3>
          <p className="c-table-empty-desc">
            Hãy tải lên một file tài liệu hoặc nhập văn bản ở bảng bên trái để bắt đầu phân tích đạo văn.
          </p>
        </div>
      ) : (
        <div className="c-table-responsive">
          <table className="c-dashboard-table">
            <thead>
              <tr>
                <th style={{ width: '45%' }}>Tên tài liệu</th>
                <th style={{ width: '22%' }}>Thời gian kiểm tra</th>
                <th style={{ width: '15%' }}>Trạng thái</th>
                <th style={{ width: '18%' }}>Độ trùng lặp</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => {
                const badge = STATUS_BADGE[entry.status] || STATUS_BADGE.queued;
                const isRunning = entry.status === 'queued' || entry.status === 'running';
                const isDone = entry.status === 'done';
                const isFailed = entry.status === 'failed';

                const vs = isDone && entry.verdict ? (VERDICT_STYLE[entry.verdict] || VERDICT_STYLE.LOW) : null;
                const maxScorePct = isDone && entry.max_score !== undefined ? ((entry.max_score ?? 0) * 100).toFixed(0) : null;

                const handleRowClick = () => {
                  if (isDone) {
                    onSelectEntry(entry);
                  } else if (isRunning) {
                    onSelectProgress(entry.job_id, entry.fileName, entry.timestamp.getTime());
                  }
                };

                return (
                  <tr
                    key={entry.job_id}
                    className={`c-table-row ${isDone || isRunning ? 'c-table-row--interactive' : ''}`}
                    onClick={handleRowClick}
                  >
                    {/* Document name */}
                    <td>
                      <div className="c-table-cell-file">
                        {getFileIcon(entry.fileName)}
                        <span className="c-file-name" title={entry.fileName}>
                          {entry.fileName}
                        </span>
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td>
                      <span className="c-table-date">{formatDate(entry.timestamp)}</span>
                    </td>

                    {/* Status badge */}
                    <td>
                      <span
                        className="c-status-badge"
                        style={{ backgroundColor: badge.bg, color: badge.color }}
                      >
                        <span className={`c-status-dot ${badge.dotClass}`} style={{ backgroundColor: badge.color }} />
                        {entry.status === 'running' && entry.progress && entry.progress !== '0/0' ? (
                          <span>Quét {entry.progress}</span>
                        ) : (
                          badge.label
                        )}
                      </span>
                    </td>

                    {/* Results / Score */}
                    <td>
                      {isDone && vs && maxScorePct !== null ? (
                        <div className="c-table-score-wrapper">
                          <span
                            className="c-score-label"
                            style={{ color: vs.color, backgroundColor: vs.bg }}
                          >
                            {vs.label}
                          </span>
                          <span className="c-score-percent" style={{ color: vs.color }}>
                            {maxScorePct}%
                          </span>
                        </div>
                      ) : isFailed ? (
                        <span className="c-score-error" title={entry.error || 'Lỗi không rõ'}>
                          Chi tiết lỗi
                        </span>
                      ) : (
                        <span className="c-score-pending">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
