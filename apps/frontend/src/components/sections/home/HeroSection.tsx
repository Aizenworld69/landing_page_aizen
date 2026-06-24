import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#EFF6FF] py-24 md:py-36">
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-sky-200/50 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute top-10 right-10 w-48 h-48 bg-blue-300/20 rounded-full blur-[60px] animate-float" style={{animationDelay:'1s'}} />
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-sky-400/20 rounded-full blur-[50px] animate-float" style={{animationDelay:'2s'}} />
        <div className="absolute top-8 right-1/4 w-20 h-20 border-2 border-sky-300/30 rounded-full animate-spin-slow" />
        <div className="absolute bottom-12 left-1/4 w-10 h-10 border border-sky-400/40 rounded-full animate-spin-slow" style={{animationDuration:'8s'}} />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="animate-fade-in mb-6 inline-flex items-center gap-2 px-4 py-1.5 bg-sky-100 border border-sky-200 rounded-full">
          <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
          <span className="text-sky-600 text-xs font-semibold tracking-wide">Nền tảng đào tạo AI hàng đầu Việt Nam</span>
        </div>

        <h1 className="animate-slide-up delay-100 text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
          Làm Chủ Tương Lai cùng
          <br />
          <span className="text-sky-500 hero-text-glow">AIZEN Education</span>
        </h1>

        <p className="animate-slide-up delay-200 text-base md:text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Tăng tốc sự nghiệp với các khóa học chuyên nghiệp cao cấp, ứng dụng AI. Thiết kế dành cho các nhà lãnh đạo doanh nghiệp và những người đổi mới công nghệ.
        </p>

        <div className="animate-slide-up delay-300 flex justify-center gap-4 flex-wrap">
          <Link href="/courses">
            <Button
              size="lg"
              className="px-8 py-4 rounded-lg font-semibold bg-sky-500 hover:bg-sky-600 transition-all text-white border-0 text-base shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:-translate-y-0.5 active:translate-y-0"
            >
              Khám phá chương trình học →
            </Button>
          </Link>
          <Link href="/instructors">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 rounded-lg font-semibold text-base border-sky-200 text-sky-600 hover:bg-sky-50 hover:-translate-y-0.5 transition-all"
            >
              Gặp gỡ giảng viên
            </Button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="animate-fade-in delay-500 mt-14 grid grid-cols-3 gap-4 max-w-md mx-auto">
          {[
            { value: '500+', label: 'Học viên' },
            { value: '10+', label: 'Khóa học' },
            { value: '98%', label: 'Hài lòng' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-extrabold text-sky-500">{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}