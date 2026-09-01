import { useEffect, useState } from 'react';
import { Link } from 'react-router';

const KNOWLEDGE_TIPS = [
  {
    question: '“Trùng lặp khoảng bao nhiêu phần trăm là chấp nhận được?”',
    summary: 'Không có một ngưỡng chung cho mọi tài liệu. Cần xét quy định nơi nộp bài, vị trí trùng và cách trích dẫn nguồn.',
    href: '/kien-thuc/bao-nhieu-phan-tram-trung-lap-thi-yen-tam',
    linkLabel: 'Đọc bài về tỷ lệ trùng lặp',
  },
  {
    question: '“Một tỷ lệ thấp có đồng nghĩa với không đạo văn?”',
    summary: 'Không hẳn. Một đoạn quan trọng vẫn có thể bị sao chép, trong khi công cụ có thể chưa tiếp cận được một số nguồn đóng.',
    href: '/kien-thuc/han-che-va-sai-so',
    linkLabel: 'Tìm hiểu hạn chế và sai số',
  },
  {
    question: '“Vì sao kiểm tra văn bản tiếng Trung khó hơn?”',
    summary: 'Đặc điểm tách từ, giản thể–phồn thể và khả năng tiếp cận kho học thuật đều có thể ảnh hưởng đến kết quả đối chiếu.',
    href: '/kien-thuc/kho-khan-kiem-tra-dao-van-tieng-trung',
    linkLabel: 'Đọc về kiểm tra tài liệu tiếng Trung',
  },
  {
    question: '“C-checker tìm nội dung tương đồng bằng cách nào?”',
    summary: 'Hệ thống kết hợp LCS, N-gram, Semantic Similarity và chuỗi liên tiếp thay vì dựa vào một phép đo duy nhất.',
    href: '/kien-thuc/lcs-ngram-semantic-similarity',
    linkLabel: 'Tìm hiểu các phương pháp so khớp',
  },
  {
    question: '“Nên làm gì khi báo cáo đánh dấu một câu?”',
    summary: 'Hãy mở nguồn, đọc ngữ cảnh, kiểm tra trích dẫn và xác định phần tương đồng có hợp lý hay cần chỉnh sửa.',
    href: '/kien-thuc/huong-dan-doc-bao-cao',
    linkLabel: 'Xem hướng dẫn đọc báo cáo',
  },
];

interface JobProgressProps {
  progress: string | null;       // "3/12"
  currentSentence: string | null;
  status: 'queued' | 'running';
  startTime: number;
  onMinimize?: () => void;
}

export function JobProgress({ progress, status, startTime, currentSentence, onMinimize }: JobProgressProps) {
  const [elapsed, setElapsed] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTipIndex((index) => (index + 1) % KNOWLEDGE_TIPS.length);
    }, 9000);
    return () => window.clearInterval(timer);
  }, []);

  const [current, total] = (progress || '0/0').split('/').map(Number);
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  return (
    <div className="c-job-progress">
      {/* Top action bar if onMinimize is present */}
      {onMinimize && (
        <div className="c-job-progress-actions">
          <button className="c-btn c-btn--outline c-btn--sm" onClick={onMinimize}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ marginRight: 6 }}>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Quay lại trang chủ & xem Lịch sử
          </button>
        </div>
      )}

      {/* Header */}
      <div className="c-progress-header">
        <div className="c-progress-spinner">
          <div className="c-spinner-ring" />
        </div>
        <div>
          <div className="c-progress-title">
            {status === 'queued' ? '⏳ Đang xếp hàng...' : '⚙️ Đang phân tích văn bản...'}
          </div>
          <div className="c-progress-sub">
            MiniLM semantic + DDGS search · Thời gian: {formatTime(elapsed)}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="c-progress-section">
        <div className="c-progress-meta">
          <span>
            {total > 0 ? `Câu ${current} / ${total}` : 'Chuẩn bị...'}
          </span>
          <span className="c-progress-pct">{total > 0 ? `${pct}%` : '—'}</span>
        </div>
        <div className="c-progress-track">
          <div
            className="c-progress-fill"
            style={{ width: total > 0 ? `${pct}%` : '0%' }}
          />
        </div>
      </div>

      {/* Current sentence being scanned */}
      {currentSentence && (
        <div className="c-current-sentence">
          <div className="c-sentence-label">Đang quét câu</div>
          <div className="c-sentence-text">{currentSentence}</div>
        </div>
      )}

      {/* Rotating reading suggestion while the analysis is running */}
      <div className="c-progress-knowledge">
        <div className="c-progress-knowledge-label">Có thể bạn muốn biết</div>
        <div className="c-progress-knowledge-card" key={tipIndex}>
          <blockquote>{KNOWLEDGE_TIPS[tipIndex].question}</blockquote>
          <p>{KNOWLEDGE_TIPS[tipIndex].summary}</p>
          <Link to={KNOWLEDGE_TIPS[tipIndex].href} target="_blank" rel="noopener noreferrer">
            {KNOWLEDGE_TIPS[tipIndex].linkLabel} <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="c-progress-knowledge-dots" aria-label="Chọn nội dung gợi ý">
          {KNOWLEDGE_TIPS.map((tip, index) => (
            <button
              type="button"
              key={tip.href}
              className={index === tipIndex ? 'is-active' : ''}
              onClick={() => setTipIndex(index)}
              aria-label={`Xem gợi ý ${index + 1}`}
              aria-current={index === tipIndex ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
