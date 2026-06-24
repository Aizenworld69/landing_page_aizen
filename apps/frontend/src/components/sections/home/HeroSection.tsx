import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section className="bg-[#F8FAFC] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block mb-4 px-4 py-1.5 bg-primary-50 text-primary-600 text-sm font-semibold rounded-full border border-primary-100">
          🚀 Nền tảng đào tạo AI thực chiến hàng đầu Việt Nam
        </span>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight text-balance mb-6">
          Làm Chủ Tương Lai{' '}
          <span className="text-primary-500">cùng AIZEN Education</span>
        </h1>

        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          Học từ những chuyên gia AI thực chiến. Ứng dụng ngay vào công việc hàng ngày
          với các khóa học được thiết kế bởi đội ngũ AIZEN.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/courses">
            <Button size="lg">Khám phá chương trình học</Button>
          </Link>
          <Link href="/instructors">
            <Button size="lg" variant="outline">Gặp giảng viên</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { value: '500+', label: 'Học viên' },
            { value: '10+', label: 'Khóa học' },
            { value: '4.9★', label: 'Đánh giá' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
