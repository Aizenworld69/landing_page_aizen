import type { Metadata } from 'next';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { InstructorGrid } from '@/components/sections/instructors/InstructorGrid';
import { ToolsSection } from '@/components/sections/instructors/ToolsSection';
import { ReviewsSection } from '@/components/sections/instructors/ReviewsSection';
import type { Instructor } from '@aizen/types';

export const metadata: Metadata = {
  title: 'Giảng viên',
  description: 'Đội ngũ chuyên gia AI thực chiến của AIZEN Education',
};

async function getInstructors(): Promise<Instructor[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/instructors`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const json = (await res.json()) as { data: Instructor[] };
    return json.data;
  } catch {
    return [];
  }
}

export default async function InstructorsPage() {
  const instructors = await getInstructors();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-[#0F172A] py-16 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Đội ngũ chuyên gia
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Học từ những người làm thực tế
            </h1>
            <p className="text-gray-400">
              Tất cả giảng viên của AIZEN đều là những chuyên gia đang trực tiếp ứng dụng AI
              trong doanh nghiệp và nghiên cứu.
            </p>
          </div>
        </section>

        <InstructorGrid instructors={instructors} />
        <ToolsSection />
        <ReviewsSection />
      </main>
      <Footer />
    </>
  );
}
