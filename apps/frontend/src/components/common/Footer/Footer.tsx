import Link from 'next/link';

const FOOTER_COLS = [
  {
    title: 'AIZEN',
    links: [
      { href: '/', label: 'Trang chủ' },
      { href: '/instructors', label: 'Giảng viên' },
      { href: '/courses', label: 'Khóa học' },
    ],
  },
  {
    title: 'Nền tảng',
    links: [
      { href: '/learning-path', label: 'Lộ trình học' },
      { href: '/resources', label: 'Tài nguyên' },
      { href: '/my-courses', label: 'Khóa học của tôi' },
    ],
  },
  {
    title: 'Pháp lý',
    links: [
      { href: '/privacy', label: 'Chính sách bảo mật' },
      { href: '/terms', label: 'Điều khoản sử dụng' },
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      { href: 'mailto:support@aizen.edu.vn', label: 'support@aizen.edu.vn' },
      { href: 'https://zalo.me/aizen', label: 'Zalo: AIZEN Education' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-navy text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-white font-semibold text-sm mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm">
            © {new Date().getFullYear()}{' '}
            <span className="text-primary-500 font-semibold">AIZEN Education</span>. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">Làm chủ tương lai cùng AI</p>
        </div>
      </div>
    </footer>
  );
}
