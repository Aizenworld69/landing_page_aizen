import type { CourseModule } from '@aizen/types';

interface CourseCurriculumProps {
  modules: CourseModule[];
  headline?: string | null; // VD: "1 ngày – 6 module thực chiến"
}

function formatDuration(minutes: number): string {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} PHÚT`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}GIỜ ${m}P` : `${h}GIỜ`;
}

/**
 * Nếu module có start_time thì dùng luôn.
 * Nếu không thì tự tính từ 08:00 cộng dồn duration_minutes.
 */
function resolveStartTimes(modules: CourseModule[]): string[] {
  let totalMinutes = 8 * 60; // bắt đầu lúc 08:00
  return modules.map((mod) => {
    // Nếu admin đã set start_time → dùng luôn và update cursor
    if (mod.start_time) {
      const [h, m] = mod.start_time.split(':').map(Number);
      totalMinutes = (h ?? 8) * 60 + (m ?? 0) + mod.duration_minutes;
      return mod.start_time;
    }
    // Ngược lại tự tính
    const h = Math.floor(totalMinutes / 60) % 24;
    const mm = totalMinutes % 60;
    const label = `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    totalMinutes += mod.duration_minutes;
    return label;
  });
}

export function CourseCurriculum({ modules, headline }: CourseCurriculumProps) {
  if (!modules.length) return null;

  const startTimes = resolveStartTimes(modules);

  // Đếm số module thực sự (dùng làm fallback nếu không có headline)
  const moduleCount = modules.filter((m) => m.item_type === 'module').length;
  const displayHeadline = headline ?? `1 ngày – ${moduleCount} module thực chiến`;

  return (
    <section className="mb-12">
      <p className="text-sky-400 text-xs font-bold uppercase tracking-widest mb-2">NỘI DUNG CHƯƠNG TRÌNH</p>
      <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-8">
        {displayHeadline}
      </h2>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[72px] top-4 bottom-4 w-px bg-white/20" />

        <ol className="space-y-1">
          {modules.map((mod, idx) => {
            const timeLabel = startTimes[idx] ?? '';
            const isBreak = mod.item_type === 'break';
            const isEvent = mod.item_type === 'event';
            const isModule = mod.item_type === 'module';

            return (
              <li key={mod.id} className="flex items-start gap-0">
                {/* Time label */}
                <div className="w-[72px] flex-shrink-0 pt-4">
                  <span className={`text-xs font-mono leading-none ${
                    isModule ? 'text-white font-semibold' : 'text-slate-300'
                  }`}>
                    {timeLabel}
                  </span>
                </div>

                {/* Dot */}
                <div className="flex flex-col items-center relative w-0">
                  <div className={`w-2.5 h-2.5 rounded-full border-2 border-slate-900 ring-2 flex-shrink-0 mt-4 z-10 relative left-[-5px] ${
                    isEvent
                      ? 'bg-sky-500 ring-sky-500/50 w-3.5 h-3.5'
                      : isBreak
                      ? 'bg-slate-600 ring-white/10'
                      : 'bg-sky-400 ring-sky-400/30'
                  }`} />
                </div>

                {/* Card */}
                <div className="flex-1 ml-6 mb-2">
                  {isBreak ? (
                    /* Break item — nhẹ hơn */
                    <div className="px-4 py-3 rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm">
                      <p className="text-slate-200 text-sm font-medium">{mod.title}</p>
                      {mod.subtitle && (
                        <p className="text-slate-300 text-xs mt-0.5">{mod.subtitle}</p>
                      )}
                    </div>
                  ) : isEvent ? (
                    /* Event item (check-in, kết thúc) */
                    <div className="px-4 py-3 rounded-xl border border-sky-500/40 bg-sky-900/50 backdrop-blur-sm">
                      <p className="text-sky-300 text-sm font-medium">{mod.title}</p>
                      {mod.subtitle && (
                        <p className="text-slate-400 text-xs mt-0.5">{mod.subtitle}</p>
                      )}
                    </div>
                  ) : (
                    /* Module item — chính */
                    <div className="px-4 py-3.5 rounded-xl border border-white/20 bg-slate-900/70 backdrop-blur-sm hover:bg-slate-900/80 hover:border-sky-500/50 transition-colors group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-sm leading-snug">{mod.title}</p>
                          {mod.subtitle && (
                            <p className="text-slate-300 text-xs mt-1 leading-relaxed">{mod.subtitle}</p>
                          )}
                          {mod.description && (
                            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{mod.description}</p>
                          )}
                        </div>
                        {mod.duration_minutes > 0 && (
                          <span className="text-xs font-bold text-sky-400 flex-shrink-0 tracking-wide mt-0.5">
                            {formatDuration(mod.duration_minutes)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
