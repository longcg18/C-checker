import { useMemo, useState } from 'react';
import { JobResult } from '../lib/api';
import { api } from '../lib/api';

interface Segment {
  start: number;
  end: number;
  matchIndexes: number[];
}

function normalizeComparable(value: string) {
  return value
    .normalize('NFKC')
    .toLocaleLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, '');
}

function isExactSentenceMatch(item: JobResult['report_items'][number]) {
  const sentence = normalizeComparable(item.sentence || '');
  const source = normalizeComparable(item.body || item.snippet || '');
  return sentence.length >= 8 && source.includes(sentence);
}

function scoreTone(score: number) {
  if (score >= 0.7) return 'high';
  if (score >= 0.45) return 'medium';
  return 'low';
}

interface DocumentMatchViewProps {
  result: JobResult;
  fileName: string;
  onReset: () => void;
}

export function DocumentMatchView({ result, fileName, onReset }: DocumentMatchViewProps) {
  const text = result.original_text || '';

  const usableMatches = useMemo(
    () => result.report_items
      .map((item, originalIndex) => ({ item, originalIndex }))
      .filter(({ item }) => (
        item.sentence_start !== undefined
        && item.sentence_end !== undefined
        && item.sentence_end > item.sentence_start
      )),
    [result.report_items],
  );
  const [selected, setSelected] = useState(usableMatches[0]?.originalIndex ?? 0);
  const wholeDocumentScore = Math.max(0, Math.min(100, (result.avg_score ?? 0) * 100));
  const wholeDocumentTone = wholeDocumentScore < 10
    ? 'low'
    : wholeDocumentScore < 15
      ? 'medium'
      : wholeDocumentScore < 20
        ? 'elevated'
        : 'high';
  const runtimeMinutes = Math.max(0, result.runtime ?? 0) / 60;
  const formattedRuntime = runtimeMinutes < 1
    ? 'Dưới 1 phút'
    : `${runtimeMinutes.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} phút`;

  const segments = useMemo<Segment[]>(() => {
    const boundaries = new Set<number>([0, text.length]);
    usableMatches.forEach(({ item }) => {
      boundaries.add(Math.max(0, Math.min(text.length, item.sentence_start!)));
      boundaries.add(Math.max(0, Math.min(text.length, item.sentence_end!)));
    });
    const points = [...boundaries].sort((a, b) => a - b);
    return points.slice(0, -1).map((start, index) => {
      const end = points[index + 1];
      const matchIndexes = usableMatches.flatMap(({ item, originalIndex }) =>
        item.sentence_start! < end && item.sentence_end! > start ? [originalIndex] : [],
      );
      return { start, end, matchIndexes };
    }).filter((segment) => segment.end > segment.start);
  }, [text, usableMatches]);

  const selectMatch = (index: number, scrollDocument = false) => {
    setSelected(index);
    if (scrollDocument) {
      document.querySelector<HTMLElement>(`[data-match-indexes~="${index}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      document.getElementById(`source-match-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  if (!text || usableMatches.length === 0) {
    return <div className="c-no-matches"><div className="c-no-matches-icon">✅</div><h3>Không có vùng đánh dấu trong toàn văn</h3><p>Báo cáo này chưa có dữ liệu vị trí ký tự hoặc không tìm thấy cụm từ đủ dài để tô màu.</p></div>;
  }

  return (
    <div className="c-document-review">
      <section className="c-document-pane" aria-label="Toàn bộ văn bản được kiểm tra">
        <div className="c-document-pane-header">
          <div className="c-document-file-heading">
            <strong title={fileName}>{fileName}</strong>
            <div className="c-document-summary">
              <span><b className={`c-document-score tone-${wholeDocumentTone}`}>{wholeDocumentScore.toFixed(1)}%</b>toàn bài</span>
              <span><b>{formattedRuntime}</b>kiểm tra</span>
            </div>
          </div>
          <div className="c-document-actions">
            <button type="button" onClick={() => window.open(api.reportUrl(result.job_id), '_blank')}>Báo cáo HTML</button>
            <button type="button" onClick={() => {
              const reportUrl = api.reportUrl(result.job_id);
              window.open(`${reportUrl}${reportUrl.includes('?') ? '&' : '?'}print=true`, '_blank');
            }}>Xuất PDF</button>
            <button type="button" onClick={onReset}>Kiểm tra mới</button>
          </div>
        </div>
        <div className="c-document-text">
          {segments.map((segment) => {
            const content = text.slice(segment.start, segment.end);
            if (!segment.matchIndexes.length) return <span key={`${segment.start}-${segment.end}`}>{content}</span>;
            const primaryIndex = segment.matchIndexes.reduce((best, index) => {
              const candidateExact = isExactSentenceMatch(result.report_items[index]);
              const bestExact = isExactSentenceMatch(result.report_items[best]);
              if (candidateExact !== bestExact) return candidateExact ? index : best;
              return result.report_items[index].final_score > result.report_items[best].final_score ? index : best;
            });
            const exact = segment.matchIndexes.some((index) => isExactSentenceMatch(result.report_items[index]));
            const score = result.report_items[primaryIndex].final_score;
            return (
              <mark
                key={`${segment.start}-${segment.end}`}
                data-match-indexes={segment.matchIndexes.join(' ')}
                className={`c-document-highlight c-document-highlight--${exact ? 'exact' : 'similar'} ${segment.matchIndexes.includes(selected) ? 'is-selected' : ''}`}
                title={`${segment.matchIndexes.length} nguồn · ${exact ? 'Trùng nguyên văn' : `Tương đồng ${Math.round(score * 100)}%`}`}
                onClick={() => selectMatch(primaryIndex)}
              >{content}<sup>#{primaryIndex + 1}</sup></mark>
            );
          })}
        </div>
      </section>

      <aside className="c-source-pane" aria-label="Danh sách các vị trí được đánh dấu">
        <div className="c-source-pane-header"><strong>Các đoạn được đánh dấu</strong><span>{usableMatches.length} vị trí cần xem lại</span></div>
        <div className="c-source-list">
          {usableMatches.map(({ item, originalIndex }) => (
            <button
              type="button"
              id={`source-match-${originalIndex}`}
              className={`c-source-summary ${selected === originalIndex ? 'is-selected' : ''}`}
              key={`${item.url}-${originalIndex}`}
              onClick={() => selectMatch(originalIndex, true)}
            >
              <div className="c-source-summary-top"><span>#{originalIndex + 1}</span><strong className={`tone-${scoreTone(item.final_score)}`}>{Math.round(item.final_score * 100)}%</strong></div>
              <div className="c-source-summary-title">{item.title || 'Nguồn không có tiêu đề'}</div>
              <div className="c-source-summary-sentence">{item.sentence}</div>
              <div className="c-source-summary-domain">{(() => { try { return new URL(item.url).hostname; } catch { return item.url; } })()}</div>
            </button>
          ))}
        </div>
        {result.report_items[selected] && (
          <div className="c-source-selected-detail">
            <a href={result.report_items[selected].url} target="_blank" rel="noopener noreferrer">Mở nguồn ↗</a>
          </div>
        )}
      </aside>
    </div>
  );
}
