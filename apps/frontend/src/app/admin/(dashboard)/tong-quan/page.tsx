'use client';

import { useEffect, useState } from 'react';
import { getAdminStats, getRegistrations } from '@/lib/admin/api';
import type { AdminStats, Registration } from '@/lib/admin/api';

function StatCard({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] p-5" style={{ background: 'rgba(15,28,48,0.7)' }}>
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      {sub && <p className="text-slate-600 text-xs mt-1">{sub}</p>}
    </div>
  );
}

export default function TongQuanPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recent, setRecent] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [s, r] = await Promise.all([
          getAdminStats(),
          getRegistrations({ page: 1, limit: 5 }),
        ]);
        setStats(s);
        setRecent(r.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <svg className="animate-spin h-8 w-8 text-sky-400" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );

  if (error) return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-400 text-sm">{error}</div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-black text-white">Tổng quan</h1>
        <p className="text-slate-500 text-sm mt-0.5">Thống kê hoạt động đăng ký</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Tổng đăng ký" value={stats?.total ?? 0} color="text-white" />
        <StatCard label="Hôm nay" value={stats?.today ?? 0} color="text-sky-400"
          sub={`/ ${stats?.total ?? 0} tổng`} />
        <StatCard label="Khóa học" value={stats?.byCourse.length ?? 0} color="text-emerald-400"
          sub="đang nhận đăng ký" />
      </div>

      {/* By course */}
      {(stats?.byCourse.length ?? 0) > 0 && (
        <div className="rounded-2xl border border-white/[0.08] overflow-hidden" style={{ background: 'rgba(15,28,48,0.7)' }}>
          <div className="px-5 py-4 border-b border-white/[0.08]">
            <h2 className="font-bold text-white text-sm">Đăng ký theo khóa học</h2>
          </div>
          <div className="divide-y divide-white/5">
            {stats!.byCourse.map((c) => (
              <div key={c.courseId} className="flex items-center justify-between px-5 py-3.5">
                <p className="text-slate-300 text-sm truncate max-w-[70%]">{c.title}</p>
                <span className="text-sky-400 font-bold text-sm">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent */}
      <div className="rounded-2xl border border-white/[0.08] overflow-hidden" style={{ background: 'rgba(15,28,48,0.7)' }}>
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <h2 className="font-bold text-white text-sm">Đăng ký gần nhất</h2>
          <a href="/admin/dang-ky" className="text-sky-400 text-xs hover:text-sky-300 transition-colors">Xem tất cả →</a>
        </div>
        {recent.length === 0 ? (
          <p className="text-slate-500 text-sm px-5 py-8 text-center">Chưa có đăng ký</p>
        ) : (
          <div className="divide-y divide-white/5">
            {recent.map((r) => (
              <div key={r.id} className="px-5 py-3.5 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-sky-400 font-bold text-xs flex-shrink-0">
                  {r.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{r.full_name}</p>
                  <p className="text-slate-500 text-xs truncate">{r.email} · {r.phone}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-slate-400 text-xs">{r.courses?.title ?? '-'}</p>
                  <p className="text-slate-600 text-[10px]">{new Date(r.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
