'use client';

import { useEffect, useState, useCallback } from 'react';
import { getRegistrations } from '@/lib/admin/api';
import type { Registration, RegistrationsPage } from '@/lib/admin/api';

const PLAN_LABEL: Record<string, string> = {
  individual: 'Cá nhân',
  group: 'Nhóm',
  early_bird: 'Early Bird',
};

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${color}`}>
      {text}
    </span>
  );
}

export default function DangKyPage() {
  const [result, setResult] = useState<RegistrationsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  const load = useCallback(async (pg: number, q: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await getRegistrations({ page: pg, limit: 20, search: q || undefined });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page, search); }, [load, page, search]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  }

  function exportCsv() {
    if (!result?.data.length) return;
    const header = 'ID,Họ tên,Điện thoại,Email,Công ty,Chức vụ,Gói,Nguồn,Khóa học,Ngày đăng ký';
    const rows = result.data.map((r) =>
      [r.id, r.full_name, r.phone, r.email, r.company ?? '', r.position ?? '',
       PLAN_LABEL[r.plan] ?? r.plan, r.referral, r.courses?.title ?? '',
       new Date(r.created_at).toLocaleString('vi-VN')].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `dang-ky-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  const registrations: Registration[] = result?.data ?? [];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-black text-white">Danh sách đăng ký</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {result ? `${result.total} đăng ký tổng cộng` : 'Đang tải...'}
          </p>
        </div>
        <button onClick={exportCsv} disabled={!result?.data.length}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm font-semibold disabled:opacity-40">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Xuất CSV
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm tên, email, SĐT..."
            style={{ color: '#fff', WebkitTextFillColor: '#fff' }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/[0.12] bg-white/[0.05] text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-colors" />
        </div>
        <button type="submit"
          className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-colors">
          Tìm
        </button>
        {search && (
          <button type="button" onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}
            className="px-4 py-2.5 rounded-xl border border-white/[0.12] text-slate-400 hover:text-white text-sm transition-colors">
            Xoá
          </button>
        )}
      </form>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 text-sm">{error}</div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.08] overflow-hidden" style={{ background: 'rgba(15,28,48,0.7)' }}>
        {/* Desktop table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                {['Họ tên', 'Liên hệ', 'Công ty', 'Gói', 'Khóa học', 'Nguồn', 'Ngày'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center">
                  <svg className="animate-spin h-6 w-6 text-sky-400 mx-auto" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </td></tr>
              ) : registrations.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500 text-sm">
                  {search ? `Không tìm thấy kết quả cho "${search}"` : 'Chưa có đăng ký nào'}
                </td></tr>
              ) : registrations.map((r) => (
                <tr key={r.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="text-white font-semibold whitespace-nowrap">{r.full_name}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-slate-300 whitespace-nowrap">{r.phone}</p>
                    <p className="text-slate-500 text-xs">{r.email}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-slate-400 whitespace-nowrap max-w-[120px] truncate">{r.company ?? '—'}</p>
                    {r.position && <p className="text-slate-600 text-xs">{r.position}</p>}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge text={PLAN_LABEL[r.plan] ?? r.plan}
                      color={r.plan === 'group' ? 'bg-emerald-500/15 text-emerald-400' : r.plan === 'early_bird' ? 'bg-amber-500/15 text-amber-400' : 'bg-sky-500/15 text-sky-400'} />
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-slate-300 text-xs whitespace-nowrap max-w-[140px] truncate">{r.courses?.title ?? r.course_id}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-slate-500 text-xs max-w-[120px] truncate">{r.referral}</p>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <p className="text-slate-400 text-xs">{new Date(r.created_at).toLocaleDateString('vi-VN')}</p>
                    <p className="text-slate-600 text-[10px]">{new Date(r.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {result && result.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.08]">
            <p className="text-slate-500 text-xs">
              Trang {result.page} / {result.totalPages} · {result.total} kết quả
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-white/[0.12] text-slate-400 hover:text-white disabled:opacity-30 text-xs transition-colors">
                ← Trước
              </button>
              <button onClick={() => setPage((p) => Math.min(result.totalPages, p + 1))} disabled={page === result.totalPages}
                className="px-3 py-1.5 rounded-lg border border-white/[0.12] text-slate-400 hover:text-white disabled:opacity-30 text-xs transition-colors">
                Sau →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
