import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left — course content */}
            <div className="lg:col-span-2">
              <CourseHero course={course} />
              <CourseSkills />
              <CourseCurriculum modules={course.course_modules} />
              {course.instructors && (
                <InstructorCard
                  instructor={{
                    ...course.instructors,
                    bio: course.instructors.bio ?? '',
                  }}
                />
              )}
            </div>

            {/* Right — sticky registration form */}
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
      <Footer />
    </>
  );
}
