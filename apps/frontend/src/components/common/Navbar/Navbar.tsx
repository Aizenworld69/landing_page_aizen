'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

const NAV_LINKS = [
  { href: '/courses', label: 'Khóa học' },
  { href: '/instructors', label: 'Giảng viên' },
  { href: '/learning-path', label: 'Lộ trình' },
  { href: '/resources', label: 'Tài nguyên' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="AIZEN Education"
              width={120}
              height={40}
              className="object-contain h-9 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-sm font-medium transition-colors relative pb-1',
                  pathname.startsWith(href)
                    ? 'text-sky-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-sky-500 after:rounded-full'
                    : 'text-gray-700 hover:text-sky-500',
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Login CTA */}
          <div className="hidden md:flex items-center">
            <Link
              href="/auth/login"
              className="text-sm font-bold text-sky-500 hover:text-sky-600 tracking-wide uppercase"
            >
              Đăng nhập
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-1">
            <nav className="flex flex-col gap-1 pt-3">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname.startsWith(href)
                      ? 'bg-sky-50 text-sky-600'
                      : 'text-gray-700 hover:bg-gray-50',
                  )}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-sm font-bold text-sky-500 uppercase tracking-wide"
              >
                Đăng nhập
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
