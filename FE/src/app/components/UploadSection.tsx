import { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface UploadSectionProps {
  onAnalyze: (fileName: string, text: string) => void;
  isAnalyzing: boolean;
  onReset: () => void;
  currentPhase: string;
  isLoggedIn?: boolean;
}

export function UploadSection({ onAnalyze, isAnalyzing, onReset, currentPhase, isLoggedIn = false }: UploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [mode, setMode] = useState<'upload' | 'text'>('text');
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chineseCharCount = (text: string) =>
    (text.match(/[\u4e00-\u9fff]/g) || []).length;

  const hasChineseText = chineseCharCount(textInput) > 5;
  const isTrialExceeded = !isLoggedIn && textInput.length > 300;

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

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setIsParsing(true);
    setMode('text');

    try {
      if (file.name.toLowerCase().endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(' ') + '\n';
        }
        setTextInput(text);
      } else if (file.name.toLowerCase().endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setTextInput(result.value);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setTextInput(e.target?.result as string || '');
          setIsParsing(false);
        };
        reader.readAsText(file, 'utf-8');
        return; // Don't run setIsParsing(false) below since it's async
      }
    } catch (err) {
      console.error('File parsing error', err);
      setTextInput('Có lỗi xảy ra khi đọc file này. Vui lòng thử file khác.');
    }
    
    setIsParsing(false);
  };

  const handleAnalyze = () => {
    if (textInput.trim() && hasChineseText) {
      if (isTrialExceeded) return;
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
          <p className="c-upload-sub">
            {isLoggedIn ? 'Nhập văn bản tiếng Trung để phân tích' : 'Dùng thử miễn phí giới hạn 300 ký tự'}
          </p>
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
        isLoggedIn ? (
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
              accept=".txt,.pdf,.docx"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <div className="c-dropzone-icon">
              <svg viewBox="0 0 48 48" fill="none">
                <path d="M24 32V16M16 24l8-8 8 8" stroke="var(--c-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 36v2a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2v-2" stroke="var(--c-text-dim)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="c-dropzone-text">Kéo thả file hoặc click để chọn</p>
            <p className="c-dropzone-hint">Hỗ trợ .txt, .pdf, .docx có nội dung tiếng Trung</p>
          </div>
        ) : (
          <div className="c-dropzone" style={{ cursor: 'default', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', borderStyle: 'dashed', borderColor: 'var(--c-border)', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.02)' }}>
            <div className="c-dropzone-icon" style={{ opacity: 0.7, marginBottom: '8px', fontSize: '24px' }}>
              🔒
            </div>
            <p className="c-dropzone-text" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--c-text)', marginBottom: '4px' }}>Tính năng tải file đã bị khóa</p>
            <p className="c-dropzone-hint" style={{ textAlign: 'center', fontSize: '11px', color: 'var(--c-text-dim)', maxWidth: '280px', margin: '0 auto' }}>
              Vui lòng đăng nhập ở góc trên cùng bên phải để tải file tài liệu (.docx, .pdf, .txt).
            </p>
          </div>
        )
      )}

      {/* Text area */}
      {mode === 'text' && (
        <div className="c-textarea-wrap">
          <textarea
            className="c-textarea"
            value={isParsing ? 'Đang đọc nội dung file...' : textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="粘贴中文文本到这里进行查重...&#10;&#10;（请输入至少包含6个汉字的中文文本）"
            disabled={isAnalyzing || isParsing}
          />
        </div>
      )}

      {/* Stats bar */}
      {textInput && !isParsing && (
        <div className="c-stats-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
          {isTrialExceeded && (
            <div className="c-warn-badge" style={{ color: 'var(--c-red)', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
              ⚠ Vượt quá 300 ký tự dùng thử. Vui lòng đăng nhập để tiếp tục!
            </div>
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
          className={`c-btn c-btn--primary c-btn--full ${isAnalyzing || isParsing ? 'c-btn--loading' : ''}`}
          onClick={handleAnalyze}
          disabled={!textInput.trim() || !hasChineseText || isAnalyzing || isParsing || isTrialExceeded}
        >
          {isAnalyzing ? (
            <>
              <span className="c-btn-spinner" />
              Đang phân tích...
            </>
          ) : isParsing ? (
             <>
              <span className="c-btn-spinner" />
              Đang đọc file...
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