import type { CourseModule } from '@aizen/types';

interface CourseCurriculumProps {
  modules: CourseModule[];
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} PHÚT`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}GIỜ ${m}P` : `${h}GIỜ`;
}

// Cumulative time tracker starting at 8:00 AM
function buildTimeSlots(modules: CourseModule[]) {
  let totalMinutes = 8 * 60; // start at 8:00
  return modules.map((mod) => {
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    const label = `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
    totalMinutes += mod.duration_minutes;
    return { mod, timeLabel: label };
  });
}

export function CourseCurriculum({ modules }: CourseCurriculumProps) {
  if (!modules.length) return null;

  const slots = buildTimeSlots(modules);

  return (
    <section className="mb-12">
      <p className="text-sky-500 text-xs font-bold uppercase tracking-widest mb-2">NỘI DUNG CHƯƠNG TRÌNH</p>
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8">
        1 ngày – {modules.length} module thực chiến
      </h2>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-16 top-0 bottom-0 w-px bg-sky-200" />

        <ol className="space-y-0">
          {slots.map(({ mod, timeLabel }, idx) => (
            <li key={mod.id} className="flex items-stretch gap-0">
              {/* Time label */}
              <div className="w-16 flex-shrink-0 flex items-start pt-5">
                <span className="text-xs font-mono text-gray-400 leading-none">{timeLabel}</span>
              </div>

              {/* Dot */}
              <div className="flex flex-col items-center w-0 relative">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-400 border-2 border-white ring-2 ring-sky-100 flex-shrink-0 mt-5 z-10 relative left-[-5px]" />
                {idx < slots.length - 1 && (
                  <div className="flex-1 w-px bg-transparent" />
                )}
              </div>

              {/* Card */}
              <div className="flex-1 ml-6 mb-4">
                <div className="bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm leading-snug">{mod.title}</p>
                      {(mod as any).subtitle && (
                        <p className="text-xs text-gray-400 mt-1">{(mod as any).subtitle}</p>
                      )}
                    </div>
                    <span className="text-xs font-bold text-gray-400 flex-shrink-0 tracking-wide">
                      {formatDuration(mod.duration_minutes)}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
