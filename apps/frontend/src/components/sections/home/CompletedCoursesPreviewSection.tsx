import Link from 'next/link';
import { CourseCard } from '@/components/sections/courses/CourseCard';
import { Button } from '@/components/ui/Button';
import type { Course } from '@aizen/types';

interface CompletedCoursesPreviewSectionProps {
  courses: Course[];
}

export function CompletedCoursesPreviewSection({ courses }: CompletedCoursesPreviewSectionProps) {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-2">
            Thư viện khóa học
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Khóa Học Đã Diễn Ra
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Xem lại toàn bộ nội dung, case study và tài liệu từ các khóa học đã hoàn thành.
          </p>
        </div>

        {/* Preview grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 mb-10">
            <p className="text-4xl mb-3">📚</p>
            <p>Chưa có khóa học nào hoàn thành.</p>
          </div>
        )}

        <div className="text-center">
          <Link href="/courses">
            <Button variant="outline" size="lg">
              Xem các khóa đã diễn ra →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
