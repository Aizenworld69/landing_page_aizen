import { getAdminToken } from './auth';

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api').replace(/\/$/, '');

// ── Response shape từ ResponseTransformInterceptor ────
interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  statusCode: number;
  timestamp: string;
  message?: string;
}

interface ApiError {
  success: false;
  statusCode: number;
  message: string | string[];
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAdminToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  let json: unknown;
  try { json = await res.json(); } catch { json = {}; }

  if (!res.ok) {
    const err = json as ApiError;
    const msg = Array.isArray(err.message) ? err.message[0] : (err.message ?? `Lỗi ${res.status}`);
    throw new Error(msg);
  }

  // Unwrap envelope { success, data, statusCode, timestamp }
  const envelope = json as ApiEnvelope<T>;
  return envelope.data !== undefined ? envelope.data : (json as T);
}

// ── Auth ──────────────────────────────────────────────
export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    fullName?: string;
  };
}

export async function adminLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  let json: unknown;
  try { json = await res.json(); } catch { json = {}; }

  if (!res.ok) {
    const err = json as ApiError;
    const msg = Array.isArray(err.message) ? err.message[0] : (err.message ?? 'Đăng nhập thất bại');
    throw new Error(msg);
  }

  // Unwrap envelope nếu có
  const envelope = json as ApiEnvelope<LoginResponse>;
  const payload = envelope.data ?? (json as LoginResponse);

  if (!payload.accessToken) {
    throw new Error('Server không trả về token');
  }
  return payload;
}

// ── Registrations ─────────────────────────────────────
export interface Registration {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  company?: string;
  position?: string;
  referral: string;
  plan: string;
  created_at: string;
  course_id: string;
  courses?: { title: string; price?: number; price_group?: number } | null;
}

export interface RegistrationsPage {
  data: Registration[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getRegistrations(params: {
  page?: number;
  limit?: number;
  search?: string;
  courseId?: string;
}): Promise<RegistrationsPage> {
  const q = new URLSearchParams();
  if (params.page) q.set('page', String(params.page));
  if (params.limit) q.set('limit', String(params.limit));
  if (params.search) q.set('search', params.search);
  if (params.courseId) q.set('courseId', params.courseId);
  return adminFetch<RegistrationsPage>(`/registrations?${q.toString()}`);
}

export interface AdminStats {
  total: number;
  today: number;
  byCourse: { courseId: string; title: string; count: number }[];
}

export async function getAdminStats(): Promise<AdminStats> {
  return adminFetch<AdminStats>('/registrations/stats');
}