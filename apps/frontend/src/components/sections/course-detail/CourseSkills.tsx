const SKILLS = [
  {
    id: 'cowork',
    icon: (
      <svg className="w-7 h-7 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Claude Cowork',
    description: 'Cowork là cả một phòng ban AI trong lòng bàn tay – mọi agent đảm nhận một vai trò, tư vấn hành, tự phối hợp với nhau, và giao cho bạn kết quả cuối cùng như một đội ngũ thực thụ.',
    featured: true,
  },
  {
    id: 'skills',
    icon: (
      <svg className="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    label: 'Claude Skills',
    description: 'Biến mỗi nhân sự hoặc quy trình công ty thành Skill có định – gọi một lúc nhiều Skills, Claude tự xử lý đa nhiệm mà không cần ra lệnh lại.',
    featured: false,
  },
  {
    id: 'projects',
    icon: (
      <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    label: 'Claude Projects',
    description: 'Giao việc cho doanh nghiệp, giúp bạn tạo ra những \'chuyên gia ảo\' theo từng lĩnh vực, luôn hiểu đúng context và làm việc theo chuẩn của bạn.',
    featured: false,
  },
  {
    id: 'connectors',
    icon: (
      <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    label: 'Claude Connectors',
    description: 'Chia khóa để Claude kết nối với hệ thống công việc như Gmail, Google Drive, Calendar... để xây dựng các trợ lý tự động.',
    featured: false,
  },
  {
    id: 'artifacts',
    icon: (
      <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    label: 'Claude Artifacts',
    description: 'Xây luôn cho bạn một app, website, landingpage hay công cụ tương tác ngay trong khung chat, không cần code.',
    featured: false,
  },
];

export function CourseSkills() {
  const [featured, ...rest] = SKILLS;

  return (
    <section className="mb-12">
      {/* Section label */}
      <p className="text-sky-500 text-xs font-bold uppercase tracking-widest mb-2">KỸ NĂNG BẠN SẼ CÓ</p>
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-7">
        Kết thúc khóa học<br />bạn sở hữu ngay
      </h2>

      {/* Grid: featured left + 2x2 right */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Featured card */}
        <div className="sm:row-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col">
          <div className="mb-3">{featured.icon}</div>
          <span className="inline-block px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded mb-3 w-fit uppercase tracking-wide">
            ĐẶC BIỆT
          </span>
          <p className="font-bold text-gray-900 text-base mb-2">{featured.label}</p>
          <p className="text-gray-500 text-sm leading-relaxed">{featured.description}</p>
        </div>

        {/* Other 4 cards in 2x2 */}
        {rest.map((skill) => (
          <div key={skill.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-2">
            <div>{skill.icon}</div>
            <p className="font-semibold text-gray-900 text-sm">{skill.label}</p>
            <p className="text-gray-500 text-xs leading-relaxed">{skill.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
