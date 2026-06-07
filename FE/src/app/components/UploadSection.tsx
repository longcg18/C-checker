import { useState, useRef } from 'react';

interface UploadSectionProps {
  onAnalyze: (fileName: string, text: string) => void;
  isAnalyzing: boolean;
  onReset: () => void;
  currentPhase: string;
}

export function UploadSection({ onAnalyze, isAnalyzing, onReset, currentPhase }: UploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [mode, setMode] = useState<'upload' | 'text'>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chineseCharCount = (text: string) =>
    (text.match(/[\u4e00-\u9fff]/g) || []).length;

  const hasChineseText = chineseCharCount(textInput) > 5;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setTextInput(e.target?.result as string || '');
    reader.readAsText(file, 'utf-8');
    setMode('text');
  };

  const handleAnalyze = () => {
    if (textInput.trim() && hasChineseText) {
      onAnalyze(fileName || '手动输入', textInput);
    }
  };

  const clearInput = () => {
    setTextInput('');
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onReset();
  };

  const isDone = currentPhase === 'done' || currentPhase === 'error';

  return (
    <div className="c-upload-card">
      <div className="c-upload-card-header">
        <div className="c-upload-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div>
          <h2 className="c-upload-title">Kiểm tra văn bản</h2>
          <p className="c-upload-sub">Nhập văn bản tiếng Trung để phân tích</p>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="c-mode-toggle">
        <button
          className={`c-mode-btn ${mode === 'text' ? 'c-mode-btn--active' : ''}`}
          onClick={() => setMode('text')}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
            <rect x="1" y="1" width="14" height="14" rx="2" />
            <line x1="4" y1="6" x2="12" y2="6" />
            <line x1="4" y1="9" x2="10" y2="9" />
          </svg>
          Nhập văn bản
        </button>
        <button
          className={`c-mode-btn ${mode === 'upload' ? 'c-mode-btn--active' : ''}`}
          onClick={() => setMode('upload')}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
            <path d="M8 10V3M5 6l3-3 3 3" />
            <path d="M3 11v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2" />
          </svg>
          Upload file
        </button>
      </div>

      {/* Upload area */}
      {mode === 'upload' && (
        <div
          className={`c-dropzone ${dragActive ? 'c-dropzone--active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="c-hidden"
            accept=".txt"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="c-dropzone-icon">
            <svg viewBox="0 0 48 48" fill="none">
              <path d="M24 32V16M16 24l8-8 8 8" stroke="var(--c-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 36v2a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2v-2" stroke="var(--c-text-dim)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="c-dropzone-text">Kéo thả file hoặc click để chọn</p>
          <p className="c-dropzone-hint">Hỗ trợ .txt có nội dung tiếng Trung</p>
        </div>
      )}

      {/* Text area */}
      {mode === 'text' && (
        <div className="c-textarea-wrap">
          <textarea
            className="c-textarea"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="粘贴中文文本到这里进行查重...&#10;&#10;（请输入至少包含6个汉字的中文文本）"
            disabled={isAnalyzing}
          />
        </div>
      )}

      {/* Stats bar */}
      {textInput && (
        <div className="c-stats-bar">
          <div className="c-stat-item">
            <span className="c-stat-num">{chineseCharCount(textInput).toLocaleString()}</span>
            <span className="c-stat-label">Hán tự</span>
          </div>
          <div className="c-stat-divider" />
          <div className="c-stat-item">
            <span className="c-stat-num">{textInput.length.toLocaleString()}</span>
            <span className="c-stat-label">Ký tự</span>
          </div>
          {fileName && (
            <>
              <div className="c-stat-divider" />
              <div className="c-stat-item">
                <span className="c-stat-label" style={{ color: 'var(--c-accent)' }}>{fileName}</span>
              </div>
            </>
          )}
          {!hasChineseText && textInput.length > 0 && (
            <div className="c-warn-badge">⚠ Cần văn bản tiếng Trung</div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="c-action-row">
        {(textInput || isDone) && (
          <button className="c-btn c-btn--ghost" onClick={clearInput} disabled={isAnalyzing}>
            Xóa
          </button>
        )}
        <button
          id="btn-analyze"
          className={`c-btn c-btn--primary c-btn--full ${isAnalyzing ? 'c-btn--loading' : ''}`}
          onClick={handleAnalyze}
          disabled={!textInput.trim() || !hasChineseText || isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <span className="c-btn-spinner" />
              Đang phân tích...
            </>
          ) : (
            <>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="15" height="15">
                <circle cx="6" cy="6" r="4" />
                <path d="M10 10l4 4" strokeLinecap="round" />
              </svg>
              Kiểm tra đạo văn
            </>
          )}
        </button>
      </div>
    </div>
  );
}