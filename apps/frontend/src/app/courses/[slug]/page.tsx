import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { CourseHero } from '@/components/sections/course-detail/CourseHero';
import { CourseSkills } from '@/components/sections/course-detail/CourseSkills';
import { CourseCurriculum } from '@/components/sections/course-detail/CourseCurriculum';
import { InstructorCard } from '@/components/sections/course-detail/InstructorCard';
import { RegistrationForm } from '@/components/sections/course-detail/RegistrationForm';
import type { CourseWithDetails } from '@aizen/types';

async function getCourse(slug: string): Promise<CourseWithDetails | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/${slug}`,
      { next: { revalidate: 300 } },
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('fetch failed');
    const json = (await res.json()) as { data: CourseWithDetails };
    return json.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const course = await getCourse(params.slug);
  if (!course) return { title: 'Không tìm thấy khóa học' };
  return {
    title: course.title,
    description: course.description,
    openGraph: { images: course.thumbnail_url ? [course.thumbnail_url] : [] },
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const course = await getCourse(params.slug);
  if (!course) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Khóa học', href: '/courses' },
              { label: course.title },
            ]}
          />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left — course detail */}
            <div className="lg:col-span-2">
              <CourseHero course={course} />
              <CourseSkills />
              <CourseCurriculum modules={course.course_modules} />

              {/* Instructor section */}
              {course.instructors && (
                <InstructorCard
                  instructor={{
                    ...course.instructors,
                    bio: '',
                  }}
                />
              )}
            </div>

            {/* Right — registration form */}
            <div className="lg:col-span-1">
              <RegistrationForm
                courseId={course.id}
                price={course.price}
                priceGroup={course.price_group}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Zalo float button */}
      <a
        href="https://zalo.me/aizen"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#0068ff] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Chat Zalo"
      >
        <svg viewBox="0 0 48 48" className="w-8 h-8" fill="white">
          <path d="M24 4C13 4 4 12 4 22c0 5.5 2.8 10.5 7.3 14L10 40l7-2.5A20.7 20.7 0 0024 40c11 0 20-8 20-18S35 4 24 4z" />
        </svg>
      </a>

      <Footer />
    </>
  );
}
