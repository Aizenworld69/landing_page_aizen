const SKILLS = [
  { icon: '🤖', label: 'Ứng dụng AI vào công việc' },
  { icon: '📊', label: 'Phân tích dữ liệu thực chiến' },
  { icon: '⚡', label: 'Tự động hóa quy trình' },
  { icon: '💡', label: 'Tư duy AI-first' },
  { icon: '🔧', label: 'Sử dụng công cụ AI hiện đại' },
  { icon: '🚀', label: 'Triển khai giải pháp thực tế' },
];

export function CourseSkills() {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-5">Bạn sẽ học được gì?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SKILLS.map(({ icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 p-4 bg-[#F8FAFC] border border-gray-100 rounded-xl"
          >
            <span className="text-2xl flex-shrink-0">{icon}</span>
            <p className="text-sm font-medium text-gray-700">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
