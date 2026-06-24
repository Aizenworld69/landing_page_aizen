import Link from 'next/link';
import { CourseCard } from '@/components/sections/courses/CourseCard';
import type { Course } from '@aizen/types';

interface UpcomingCoursesSectionProps {
  courses: Course[];
}

export function UpcomingCoursesSection({ courses }: UpcomingCoursesSectionProps) {
  return (
    <section className="bg-[#0F172A] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-2">
              Đang mở đăng ký
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Khóa Học Sắp Khai Giảng
            </h2>
          </div>
          <Link
            href="/courses?status=upcoming"
            className="hidden sm:block text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            Xem tất cả →
          </Link>
        </div>

        {/* Cards */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} theme="dark" />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <p className="text-4xl mb-4">📅</p>
            <p>Chưa có khóa học sắp khai giảng. Hãy theo dõi để cập nhật sớm nhất!</p>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/courses?status=upcoming"
            className="text-sm text-primary-400 hover:text-primary-300 font-medium"
          >
            Xem tất cả →
          </Link>
        </div>
      </div>
    </section>
  );
}
