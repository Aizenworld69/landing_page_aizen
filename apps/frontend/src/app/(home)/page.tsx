import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { HeroSection } from '@/components/sections/home/HeroSection';
import { UpcomingCoursesSection } from '@/components/sections/home/UpcomingCoursesSection';
import { CompletedCoursesPreviewSection } from '@/components/sections/home/CompletedCoursesPreviewSection';
import type { Course, PaginatedResponse } from '@aizen/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function getUpcomingCourses(): Promise<Course[]> {
  try {
    const res = await fetch(
      `${API_URL}/courses?status=upcoming&limit=3`,
      { cache: 'no-store' },
    );
    if (!res.ok) return [];
    const json = (await res.json()) as { data: PaginatedResponse<Course> };
    return json.data?.items ?? [];
  } catch (e) {
    console.error('[getUpcomingCourses]', e);
    return [];
  }
}

async function getCompletedCourses(): Promise<Course[]> {
  try {
    const res = await fetch(
      `${API_URL}/courses?status=completed&limit=3`,
      { cache: 'no-store' },
    );
    if (!res.ok) return [];
    const json = (await res.json()) as { data: PaginatedResponse<Course> };
    return json.data?.items ?? [];
  } catch (e) {
    console.error('[getCompletedCourses]', e);
    return [];
  }
}

export default async function HomePage() {
  const [upcomingCourses, completedCourses] = await Promise.all([
    getUpcomingCourses(),
    getCompletedCourses(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <UpcomingCoursesSection courses={upcomingCourses} />
        <CompletedCoursesPreviewSection courses={completedCourses} />
      </main>
      <Footer />
    </>
  );
}