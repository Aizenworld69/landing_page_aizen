import type { CourseModule } from '@aizen/types';

interface CourseCurriculumProps {
  modules: CourseModule[];
}

export function CourseCurriculum({ modules }: CourseCurriculumProps) {
  if (!modules.length) return null;

  const totalMinutes = modules.reduce((sum, m) => sum + m.duration_minutes, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;

  return (
    <section className="mb-10">
      <div className="flex items-end justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Nội dung khóa học</h2>
        <span className="text-sm text-gray-500">
          {modules.length} buổi &middot;{' '}
          {totalHours > 0 ? `${totalHours}h ` : ''}
          {remainingMins > 0 ? `${remainingMins}p` : ''}
        </span>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200" />

        <ol className="space-y-4">
          {modules.map((mod, idx) => (
            <li key={mod.id} className="flex gap-4 relative pl-10">
              {/* Dot */}
              <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-primary-500 border-2 border-white ring-2 ring-primary-100 flex-shrink-0" />

              <div className="flex-1 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-800">
                    <span className="text-gray-400 mr-2">#{idx + 1}</span>
                    {mod.title}
                  </p>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {mod.duration_minutes} phút
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
