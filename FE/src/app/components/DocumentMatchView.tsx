import { useMemo, useState } from 'react';
import { JobResult } from '../lib/api';

interface Segment {
  start: number;
  end: number;
  matchIndexes: number[];
}

function scoreTone(score: number) {
  if (score >= 0.7) return 'high';
  if (score >= 0.45) return 'medium';
  return 'low';
}

export function DocumentMatchView({ result }: { result: JobResult }) {
  const text = result.original_text || '';

  const usableMatches = useMemo(
    () => result.report_items
      .map((item, originalIndex) => ({ item, originalIndex }))
      .filter(({ item }) => item.matched_ranges?.some((range) => range.end > range.start)),
    [result.report_items],
  );
  const [selected, setSelected] = useState(usableMatches[0]?.originalIndex ?? 0);

  const segments = useMemo<Segment[]>(() => {
    const boundaries = new Set<number>([0, text.length]);
    usableMatches.forEach(({ item }) => item.matched_ranges?.forEach((range) => {
      boundaries.add(Math.max(0, Math.min(text.length, range.start)));
      boundaries.add(Math.max(0, Math.min(text.length, range.end)));
    }));
    const points = [...boundaries].sort((a, b) => a - b);
    return points.slice(0, -1).map((start, index) => {
      const end = points[index + 1];
      const matchIndexes = usableMatches.flatMap(({ item, originalIndex }) =>
        item.matched_ranges?.some((range) => range.start < end && range.end > start) ? [originalIndex] : [],
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
        <div className="c-document-pane-header"><div><strong>Toàn bộ văn bản</strong><span>{text.length.toLocaleString()} ký tự</span></div><div className="c-highlight-legend"><span className="high">Cao</span><span className="medium">Trung bình</span><span className="low">Thấp</span></div></div>
        <div className="c-document-text">
          {segments.map((segment) => {
            const content = text.slice(segment.start, segment.end);
            if (!segment.matchIndexes.length) return <span key={`${segment.start}-${segment.end}`}>{content}</span>;
            const primaryIndex = segment.matchIndexes.reduce((best, index) => result.report_items[index].final_score > result.report_items[best].final_score ? index : best);
            const score = result.report_items[primaryIndex].final_score;
            return (
              <mark
                key={`${segment.start}-${segment.end}`}
                data-match-indexes={segment.matchIndexes.join(' ')}
                className={`c-document-highlight c-document-highlight--${scoreTone(score)} ${selected === primaryIndex ? 'is-selected' : ''}`}
                title={`${segment.matchIndexes.length} nguồn · Mức trùng lặp cao nhất ${Math.round(score * 100)}%`}
                onClick={() => selectMatch(primaryIndex)}
              >{content}<sup>#{primaryIndex + 1}</sup></mark>
            );
          })}
        </div>
      </section>

      <aside className="c-source-pane" aria-label="Danh sách các vị trí được đánh dấu">
        <div className="c-source-pane-header"><strong>Vị trí được đánh dấu</strong><span>{usableMatches.length} nguồn đối chiếu</span></div>
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
            <div><span>LCS</span><strong>{result.report_items[selected].lcs_score.toFixed(3)}</strong></div>
            <div><span>N-gram</span><strong>{result.report_items[selected].ngram_score.toFixed(3)}</strong></div>
            <div><span>Semantic</span><strong>{result.report_items[selected].semantic_score.toFixed(3)}</strong></div>
            <a href={result.report_items[selected].url} target="_blank" rel="noopener noreferrer">Mở nguồn ↗</a>
          </div>
        )}
      </aside>
    </div>
  );
}
