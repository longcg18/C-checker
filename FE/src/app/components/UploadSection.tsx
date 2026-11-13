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

const SAMPLE_TEXTS = [
  {
    label: 'Mẫu Học thuật (Giản thể)',
    tag: '简体',
    text: '人工智能在自然语言处理领域的应用日益广泛，特别是在跨语言文本相似度检测与语义表征分析中展现出了显著的优势。通过深度学习模型，研究者能够更准确地捕捉篇章结构与上下文关联。'
  },
  {
    label: 'Mẫu Ngữ pháp & Trích dẫn',
    tag: '引用',
    text: '现代汉语语法研究表明，语序和虚词是表达语法意义的重要手段。句子成分的位置变化往往会直接影响句子的语义重点与语用色彩，因此在对比分析中需要细致考量。'
  },
  {
    label: 'Mẫu Luận văn (Phồn thể)',
    tag: '繁體',
    text: '在學術論文寫作規範中，文獻引用的準確性與原創性檢測是保障學術誠信的重要環節。研究者應嚴格遵循學術規范，避免不當引述與未註明來源的轉寫。'
  }
];

export function UploadSection({ onAnalyze, isAnalyzing, onReset, currentPhase, isLoggedIn = false }: UploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [mode, setMode] = useState<'text' | 'upload'>('text');
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
        return;
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

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setTextInput(text);
        setFileName('');
      }
    } catch (err) {
      console.warn('Cannot read clipboard', err);
    }
  };

  const handleLoadSample = (sampleText: string) => {
    setTextInput(sampleText);
    setFileName('Đoạn trích mẫu');
    setMode('text');
  };

  const isDone = currentPhase === 'done' || currentPhase === 'error';

  return (
    <div className="c-studio-wrap">
      {/* ── Studio Desk Card ── */}
      <div className="c-studio-card">
        {/* Studio Top Control Bar */}
        <div className="c-studio-topbar">
          <div className="c-studio-tabs">
            <button
              type="button"
              className={`c-studio-tab ${mode === 'text' ? 'c-studio-tab--active' : ''}`}
              onClick={() => setMode('text')}
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" width="14" height="14">
                <rect x="2" y="2" width="12" height="12" rx="1.5" />
                <line x1="4.5" y1="5.5" x2="11.5" y2="5.5" />
                <line x1="4.5" y1="8" x2="11.5" y2="8" />
                <line x1="4.5" y1="10.5" x2="8.5" y2="10.5" />
              </svg>
              <span>Soạn thảo &amp; Dán văn bản</span>
            </button>

            <button
              type="button"
              className={`c-studio-tab ${mode === 'upload' ? 'c-studio-tab--active' : ''}`}
              onClick={() => setMode('upload')}
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" width="14" height="14">
                <path d="M8 10.5V2.5M5 5.5l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2.5 11v2a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-2" strokeLinecap="round" />
              </svg>
              <span>Tải tệp văn bản {isLoggedIn ? '(.docx, .pdf, .txt)' : '🔒'}</span>
            </button>
          </div>

          <div className="c-studio-tools">
            <button
              type="button"
              className="c-studio-tool-btn"
              onClick={handlePasteClipboard}
              title="Dán nhanh văn bản từ bộ nhớ tạm"
              disabled={isAnalyzing || isParsing}
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" width="13" height="13">
                <path d="M10.5 2.5h-5a1 1 0 0 0-1 1V13a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V5.5L10.5 2.5z" />
                <path d="M10.5 2.5v3h3" />
              </svg>
              <span>Dán văn bản</span>
            </button>

            {(textInput || isDone) && (
              <button
                type="button"
                className="c-studio-tool-btn c-studio-tool-btn--clear"
                onClick={clearInput}
                disabled={isAnalyzing}
                title="Xóa trắng nội dung"
              >
                ✕ Xóa
              </button>
            )}
          </div>
        </div>

        {/* 1-Click Samples Bar (When empty) */}
        {!textInput && mode === 'text' && (
          <div className="c-studio-samples-bar">
            <span className="c-samples-label">Thử nhanh đoạn mẫu:</span>
            <div className="c-samples-pills">
              {SAMPLE_TEXTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="c-sample-pill"
                  onClick={() => handleLoadSample(sample.text)}
                >
                  <span className="c-sample-tag">{sample.tag}</span>
                  <span className="c-sample-text">{sample.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Work Area: Upload Zone */}
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="32" height="32">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M12 18v-6m-3 3l3-3 3 3" />
                </svg>
              </div>
              <p className="c-dropzone-text">Kéo thả tệp hoặc nhấp để chọn từ máy tính</p>
              <p className="c-dropzone-hint">Hỗ trợ các định dạng <strong>.docx</strong>, <strong>.pdf</strong>, <strong>.txt</strong> chứa văn bản chữ Hán</p>
            </div>
          ) : (
            <div className="c-dropzone c-dropzone--locked">
              <div className="c-dropzone-icon-locked">🔒</div>
              <p className="c-dropzone-text">Tính năng tải tệp dành riêng cho thành viên</p>
              <p className="c-dropzone-hint">
                Vui lòng nhấn nút <strong>Đăng nhập Google</strong> ở góc trên bên phải để tải tệp không giới hạn độ dài và lưu trữ lịch sử đối soát.
              </p>
            </div>
          )
        )}

        {/* Main Work Area: Textarea */}
        {mode === 'text' && (
          <div className="c-textarea-wrap">
            <textarea
              className="c-studio-textarea"
              value={isParsing ? 'Đang trích xuất nội dung văn bản chữ Hán từ tệp...' : textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Dán hoặc nhập đoạn văn bản chữ Hán (简体 / 繁體) vào đây để bắt đầu đối soát...&#10;&#10;Yêu cầu văn bản chứa ít nhất 6 ký tự Hán tự để mô hình AI phân tích chính xác."
              disabled={isAnalyzing || isParsing}
              rows={9}
            />
          </div>
        )}

        {/* Studio Bottom Bar: Stats & Action */}
        <div className="c-studio-bottom-bar">
          <div className="c-studio-metrics">
            <div className="c-metric-cell">
              <span className="c-metric-val">{chineseCharCount(textInput).toLocaleString()}</span>
              <span className="c-metric-name">Hán tự</span>
            </div>
            <div className="c-metric-sep" />
            <div className="c-metric-cell">
              <span className="c-metric-val">{textInput.length.toLocaleString()}</span>
              <span className="c-metric-name">Ký tự</span>
            </div>

            {fileName && (
              <>
                <div className="c-metric-sep" />
                <div className="c-metric-cell c-metric-cell--file">
                  <span className="c-metric-name">Tệp:</span>
                  <span className="c-metric-filename">{fileName}</span>
                </div>
              </>
            )}

            {!hasChineseText && textInput.length > 0 && (
              <span className="c-studio-warning">Cần ít nhất 6 chữ Hán</span>
            )}

            {isTrialExceeded && (
              <span className="c-studio-warning c-studio-warning--limit">
                Đã vượt mức 300 ký tự dùng thử. Vui lòng đăng nhập!
              </span>
            )}
          </div>

          <div className="c-studio-action">
            <button
              id="btn-analyze"
              type="button"
              className={`c-btn-inspect ${isAnalyzing || isParsing ? 'c-btn-inspect--loading' : ''}`}
              onClick={handleAnalyze}
              disabled={!textInput.trim() || !hasChineseText || isAnalyzing || isParsing || isTrialExceeded}
            >
              {isAnalyzing ? (
                <>
                  <span className="c-btn-spinner" />
                  <span>Đang đối soát AI...</span>
                </>
              ) : isParsing ? (
                <>
                  <span className="c-btn-spinner" />
                  <span>Đang đọc tệp...</span>
                </>
              ) : (
                <>
                  <span className="c-btn-inspect-seal">印</span>
                  <span>Tiến hành đối soát văn bản</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Academic Trust Ribbon (Ngay dưới Studio) ── */}
      <div className="c-trust-ribbon">
        <div className="c-ribbon-item">
          <span className="c-ribbon-strong">99.2%</span>
          <span className="c-ribbon-label">Độ chính xác tương đồng ngữ nghĩa</span>
        </div>
        <div className="c-ribbon-div" />
        <div className="c-ribbon-item">
          <span className="c-ribbon-strong">MiniLM + LCS</span>
          <span className="c-ribbon-label">Phân tích kép ngữ nghĩa &amp; chuỗi</span>
        </div>
        <div className="c-ribbon-div" />
        <div className="c-ribbon-item">
          <span className="c-ribbon-strong">0 Ký tự lưu trữ</span>
          <span className="c-ribbon-label">Bảo mật tác quyền bản thảo</span>
        </div>
        <div className="c-ribbon-div" />
        <div className="c-ribbon-item">
          <span className="c-ribbon-strong">100% Phi lợi nhuận</span>
          <span className="c-ribbon-label">Hỗ trợ nghiên cứu học thuật</span>
        </div>
      </div>
    </div>
  );
}
