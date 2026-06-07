// API client for C-checker v5 backend

const API_BASE = 'http://localhost:8000';

export interface SubmitResponse {
  job_id: string;
  status: string;
  poll_url: string;
  report_url: string;
  result_url: string;
}

export interface JobStatus {
  job_id: string;
  status: 'queued' | 'running' | 'done' | 'failed';
  progress: string | null;
  current_sentence: string | null;
  created_at: string;
  finished_at: string | null;
  error: string | null;
}

export interface ReportItem {
  sentence: string;
  url: string;
  title: string;
  body: string;
  highlighted: string;
  matched_tokens: string[];
  snippet: string;
  lcs_score: number;
  ngram_score: number;
  semantic_score: number;
  contiguous_score: number;
  final_score: number;
}

export interface JobResult {
  job_id: string;
  status: string;
  verdict: 'HIGH' | 'MEDIUM' | 'LOW';
  verdict_text: string;
  max_score: number;
  runtime: number;
  sentences_checked: number;
  matches_found: number;
  finished_at: string;
  report_items: ReportItem[];
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok && res.status !== 202) {
    const body = await res.text();
    throw new Error(`API error ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  /** Kiểm tra backend có online không */
  health(): Promise<{ status: string; version: string }> {
    return apiFetch('/health');
  },

  /** Gửi văn bản để kiểm tra — trả về job_id ngay */
  submitCheck(text: string): Promise<SubmitResponse> {
    return apiFetch('/check', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  /** Poll trạng thái job */
  pollStatus(job_id: string): Promise<JobStatus> {
    return apiFetch(`/status/${job_id}`);
  },

  /** Lấy kết quả đầy đủ khi job done */
  getResult(job_id: string): Promise<JobResult> {
    return apiFetch(`/result/${job_id}`);
  },

  /** URL của HTML report */
  reportUrl(job_id: string): string {
    return `${API_BASE}/report/${job_id}`;
  },
};
