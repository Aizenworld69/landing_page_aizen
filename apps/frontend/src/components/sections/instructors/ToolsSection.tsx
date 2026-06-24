const TOOLS = [
  {
    name: 'Claude',
    logo: '🤖',
    description: 'AI assistant mạnh nhất cho công việc tư duy và sáng tạo nội dung.',
  },
  {
    name: 'NotebookLM',
    logo: '📓',
    description: 'Công cụ nghiên cứu AI của Google — tóm tắt tài liệu thông minh.',
  },
  {
    name: 'Grok',
    logo: '⚡',
    description: 'AI của xAI — phân tích dữ liệu thời gian thực và tư duy logic.',
  },
];

export function ToolsSection() {
  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sky-500 text-xs font-bold uppercase tracking-widest mb-2">
            Công cụ
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Bộ công cụ làm chủ AI
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            Chúng tôi đào tạo bạn sử dụng thành thạo những công cụ AI hàng đầu thế giới.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOOLS.map((tool) => (
            <div
              key={tool.name}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center hover:border-sky-300 hover:shadow-sm transition-all"
            >
              <div className="text-5xl mb-4">{tool.logo}</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{tool.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
