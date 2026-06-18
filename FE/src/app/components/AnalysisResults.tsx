import { JobResult } from '../lib/api';
import { api } from '../lib/api';

interface AnalysisResultsProps {
  result: JobResult;
  onReset: () => void;
}

const VERDICT_CONFIG = {
  HIGH: {
    label: 'CAO — Nguy cơ đạo văn cao',
    color: 'var(--c-red)',
    bg: 'rgba(224, 87, 87, 0.10)',
    border: 'rgba(224, 87, 87, 0.40)',
    icon: '🔴',
  },
  MEDIUM: {
    label: 'TRUNG BÌNH — Có dấu hiệu nghi ngờ',
    color: '#e8a838',
    bg: 'rgba(232, 168, 56, 0.10)',
    border: 'rgba(232, 168, 56, 0.40)',
    icon: '🟡',
  },
  LOW: {
    label: 'THẤP — Không phát hiện đạo văn rõ ràng',
    color: 'var(--c-green)',
    bg: 'rgba(68, 201, 138, 0.10)',
    border: 'rgba(68, 201, 138, 0.40)',
    icon: '🟢',
  },
};

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 0.7 ? 'var(--c-red)' : score >= 0.45 ? '#e8a838' : 'var(--c-green)';
  return (
    <div className="c-score-bar-track">
      <div
        className="c-score-bar-fill"
        style={{ width: `${Math.round(score * 100)}%`, background: color }}
      />
    </div>
  );
}

function ScorePill({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`c-score-pill ${highlight ? 'c-score-pill--highlight' : ''}`}>
      <span className="c-score-pill-label">{label}</span>
      <strong className="c-score-pill-value">{value.toFixed(3)}</strong>
    </div>
  );
}

export function AnalysisResults({ result, onReset }: AnalysisResultsProps) {
  const vc = VERDICT_CONFIG[result.verdict] || VERDICT_CONFIG.LOW;

  const formatRuntime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = (s % 60).toFixed(1);
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  return (
    <div className="c-results">
      {/* ── Verdict Banner ── */}
      <div
        className="c-verdict-banner"
        style={{ background: vc.bg, borderColor: vc.border, color: vc.color }}
      >
        <div className="c-verdict-icon">{vc.icon}</div>
        <div>
          <div className="c-verdict-label">Kết luận kiểm tra</div>
          <div className="c-verdict-text">{vc.label}</div>
        </div>
        <div className="c-verdict-score">
          <div className="c-verdict-score-num" style={{ color: vc.color }}>
            {((result.max_score ?? 0) * 100).toFixed(0)}%
          </div>
          <div className="c-verdict-score-label">Điểm cao nhất</div>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="c-stats-grid">
        <div className="c-stat-card">
          <div className="c-stat-card-value">{result.sentences_checked}</div>
          <div className="c-stat-card-label">Câu đã kiểm tra</div>
        </div>
        <div className="c-stat-card">
          <div className="c-stat-card-value" style={{ color: result.matches_found > 0 ? 'var(--c-red)' : 'var(--c-green)' }}>
            {result.matches_found}
          </div>
          <div className="c-stat-card-label">Đoạn nghi ngờ</div>
        </div>
        <div className="c-stat-card">
          <div className="c-stat-card-value">{(result.max_score ?? 0).toFixed(3)}</div>
          <div className="c-stat-card-label">Điểm max</div>
        </div>
        <div className="c-stat-card">
          <div className="c-stat-card-value">{formatRuntime(result.runtime)}</div>
          <div className="c-stat-card-label">Thời gian</div>
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="c-result-actions">
        <button
          className="c-btn c-btn--primary"
          onClick={() => window.open(api.reportUrl(result.job_id), '_blank')}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="15" height="15">
            <path d="M10 2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
            <line x1="6" y1="6" x2="10" y2="6" />
            <line x1="6" y1="9" x2="9" y2="9" />
          </svg>
          Xem báo cáo HTML
        </button>
        <button
          className="c-btn c-btn--primary"
          style={{ background: 'linear-gradient(135deg, var(--c-accent2, #d97706), #f59e0b)', boxShadow: '0 2px 10px rgba(217, 119, 6, 0.25)' }}
          onClick={() => window.open(`${api.reportUrl(result.job_id)}?print=true`, '_blank')}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="15" height="15">
            <path d="M4 4h8v-2h-8v2zM4 12h8v2h-8v-2zm-2-6h12v6h-2v-2h-8v2h-2v-6z" />
          </svg>
          Xuất báo cáo PDF
        </button>
        <button className="c-btn c-btn--ghost" onClick={onReset}>
          Kiểm tra mới
        </button>
      </div>

      {/* ── Match Cards ── */}
      {result.report_items.length === 0 ? (
        <div className="c-no-matches">
          <div className="c-no-matches-icon">✅</div>
          <h3>Không phát hiện đạo văn</h3>
          <p>Không tìm thấy nguồn nào có nội dung tương đồng đáng kể.</p>
        </div>
      ) : (
        <div className="c-matches-section">
          <div className="c-section-heading">
            <span className="c-section-badge">{result.report_items.length}</span>
            Đoạn văn nghi ngờ
          </div>

          {result.report_items.map((item, idx) => (
            <div className="c-match-card" key={idx} id={`match-${idx + 1}`}>
              {/* Card header */}
              <div className="c-match-header">
                <span className="c-match-num">#{idx + 1}</span>
                <div className="c-match-title-block">
                  <div className="c-match-title">{item.title || '(Không có tiêu đề)'}</div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="c-match-url"
                  >
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" width="10" height="10">
                      <path d="M5 2H2v8h8V7M7 1h4v4M9 3 5 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item.url.length > 70 ? item.url.slice(0, 70) + '…' : item.url}
                  </a>
                </div>
                <div
                  className="c-match-final-score"
                  style={{
                    color: item.final_score >= 0.7 ? 'var(--c-red)' : item.final_score >= 0.45 ? '#e8a838' : 'var(--c-green)',
                  }}
                >
                  {((item.final_score ?? 0) * 100).toFixed(0)}%
                </div>
              </div>

              {/* Score bar */}
              <ScoreBar score={item.final_score} />

              {/* Score pills */}
              <div className="c-score-pills">
                <ScorePill label="LCS" value={item.lcs_score} />
                <ScorePill label="N-gram" value={item.ngram_score} />
                <ScorePill label="Semantic" value={item.semantic_score} />
                <ScorePill label="Contiguous" value={item.contiguous_score} />
                <ScorePill label="Final" value={item.final_score} highlight />
              </div>

              {/* Sentence */}
              <div className="c-detail-block">
                <div className="c-detail-label">📝 Câu gốc</div>
                <div className="c-detail-content c-sentence-orig">{item.sentence}</div>
              </div>

              {/* Highlighted tokens */}
              {item.highlighted && (
                <div className="c-detail-block">
                  <div className="c-detail-label">🔆 Từ khớp (highlight)</div>
                  <div
                    className="c-detail-content c-highlighted"
                    dangerouslySetInnerHTML={{ __html: item.highlighted }}
                  />
                </div>
              )}

              {/* Matched tokens */}
              {item.matched_tokens.length > 0 && (
                <div className="c-detail-block">
                  <div className="c-detail-label">🔗 Tokens trùng</div>
                  <div className="c-token-list">
                    {item.matched_tokens.map((t, i) => (
                      <span key={i} className="c-token">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Snippet */}
              {(item.snippet || item.body) && (
                <div className="c-detail-block">
                  <div className="c-detail-label">📄 Đoạn trích từ nguồn</div>
                  <div className="c-detail-content c-snippet">
                    {item.snippet || item.body}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}