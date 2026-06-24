import { Badge } from '@/components/ui/Badge';
import { formatDateLong } from '@/lib/utils/format';
import type { CourseWithDetails } from '@aizen/types';

interface CourseHeroProps {
  course: CourseWithDetails;
}

export function CourseHero({ course }: CourseHeroProps) {
  return (
    <div className="mb-8">
      <Badge variant="special" className="mb-4">KHÓA HỌC THỰC CHIẾN</Badge>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
        {course.title}
      </h1>
      <p className="text-gray-500 text-lg leading-relaxed mb-6">{course.description}</p>

      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
        {course.start_date && (
          <span className="flex items-center gap-1.5">
            📅 <span>{formatDateLong(course.start_date)}</span>
          </span>
        )}
        {course.category && (
          <span className="flex items-center gap-1.5">
            🏷️ <span>{course.category}</span>
          </span>
        )}
        {course.instructors && (
          <span className="flex items-center gap-1.5">
            👤 <span>GV: {course.instructors.name}</span>
          </span>
        )}
      </div>
    </div>
  );
}
