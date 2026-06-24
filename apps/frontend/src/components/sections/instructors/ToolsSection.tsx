import Image from 'next/image';

export function ToolsSection() {
  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sky-500 text-xs font-bold uppercase tracking-widest mb-2">
            Công cụ
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Bộ công cụ làm chủ AI
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            Thanh thạo các công cụ AI hàng đầu như Claude, NotebookLM và Grok để bứt
            phá hiệu suất công việc của bạn.
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            src="/anhtronggiangvien.png"
            alt="Bộ công cụ AI: Claude, NotebookLM và Grok"
            width={700}
            height={500}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}

