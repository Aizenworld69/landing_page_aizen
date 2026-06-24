import type { CourseWithDetails } from '@aizen/types';

interface CourseHeroProps {
  course: CourseWithDetails;
}

export function CourseHero({ course }: CourseHeroProps) {
  return (
    <div className="mb-10">
      {/* Badge */}
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-600 tracking-wide uppercase mb-5">
        <span className="text-sky-500">⊙</span> KHÓA HỌC THỰC CHIẾN
      </span>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
        {course.title}
      </h1>

      {/* Description */}
      <p className="text-gray-500 text-base leading-relaxed max-w-xl">
        {course.description}
      </p>
    </div>
  );
}
