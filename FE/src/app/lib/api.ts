// API client for C-checker v5 backend

const API_BASE = 'http://localhost:8000';

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

export function setToken(token: string) {
  localStorage.setItem('c_checker_token', token);
}
export function getToken() {
  return localStorage.getItem('c_checker_token');
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
    const body = await res.text();
    throw new Error(`API error ${res.status}: ${body}`);
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

  getHistory(): Promise<any[]> {
    return apiFetch('/history');
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
    return `${API_BASE}/report/${job_id}`;
  },

  streamUrl(job_id: string): string {
    const token = getToken();
    return `${API_BASE}/stream/${job_id}?token=${token || ''}`;
  }
};
