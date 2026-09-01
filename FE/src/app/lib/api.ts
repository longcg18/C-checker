// API client for C-checker v5 backend

const API_BASE = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8000'
  : 'https://api.c-checker.io.vn';

export interface SubmitResponse {
  job_id: string;
  status: string;
  poll_url: string;
  stream_url: string;
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
  sentence_index?: number;
  sentence_start?: number;
  sentence_end?: number;
  matched_ranges?: Array<{ start: number; end: number }>;
}

export interface JobResult {
  job_id: string;
  status: string;
  verdict: 'HIGH' | 'MEDIUM' | 'LOW';
  verdict_text: string;
  max_score: number;
  avg_score?: number;
  runtime: number;
  sentences_checked: number;
  matches_found: number;
  finished_at: string;
  report_items: ReportItem[];
  text_length?: number;
  original_text?: string;
}

export interface HistoryItemRaw {
  job_id: string;
  fileName: string;
  timestamp: string;
  status: 'queued' | 'running' | 'done' | 'failed';
  verdict?: 'HIGH' | 'MEDIUM' | 'LOW';
  verdict_text?: string;
  max_score?: number;
  matches_found?: number;
  progress?: string;
  current_sentence?: string;
  error?: string;
  result?: JobResult;
}

export function setToken(token: string) {
  localStorage.setItem('c_checker_token', token);
}
export function getToken() {
  return typeof window === 'undefined' ? null : localStorage.getItem('c_checker_token');
}
export function removeToken() {
  localStorage.removeItem('c_checker_token');
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    headers: { ...headers, ...(options?.headers || {}) },
    ...options,
  });
  if (!res.ok && res.status !== 202) {
    // FastAPI errors come back as {"detail": "..."} (or {"detail": [...]} for 422).
    // Extract a human-readable message instead of dumping the raw body.
    const raw = await res.text();
    let message = `API error ${res.status}`;
    try {
      const data = JSON.parse(raw);
      if (data && typeof data.detail === 'string') message = data.detail;
      else if (data && typeof data.detail === 'object') message = JSON.stringify(data.detail);
      else if (data && typeof data.message === 'string') message = data.message;
      else if (raw) message = raw;
    } catch {
      if (raw) message = raw;
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export const api = {
  health(): Promise<{ status: string; version: string }> {
    return apiFetch('/health');
  },

  login(googleToken: string): Promise<{ access_token: string; user: any }> {
    return apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ token: googleToken })
    });
  },

  loginLocal(username: string, password: string): Promise<{ access_token: string; user: any }> {
    return apiFetch('/login/local', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },

  register(username: string, password: string, email?: string, name?: string): Promise<{ access_token: string; user: any }> {
    return apiFetch('/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, email, name })
    });
  },

  getHistory(): Promise<HistoryItemRaw[]> {
    return apiFetch('/history');
  },

  deleteHistory(job_id: string): Promise<{ deleted: boolean; job_id: string }> {
    return apiFetch(`/history/${job_id}`, { method: 'DELETE' });
  },

  submitCheck(text: string, fileName?: string): Promise<SubmitResponse> {
    return apiFetch('/check', {
      method: 'POST',
      body: JSON.stringify({ text, file_name: fileName || "Manual Input" }),
    });
  },

  getResult(job_id: string): Promise<JobResult> {
    return apiFetch(`/result/${job_id}`);
  },

  reportUrl(job_id: string): string {
    const token = getToken();
    return `${API_BASE}/report/${job_id}${token ? `?token=${encodeURIComponent(token)}` : ''}`;
  },

  streamUrl(job_id: string): string {
    const token = getToken();
    return `${API_BASE}/stream/${job_id}?token=${token || ''}`;
  }
};
