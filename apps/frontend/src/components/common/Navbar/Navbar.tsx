'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';

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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary-500 tracking-tight">AIZEN</span>
            <span className="text-xl font-light text-gray-400 hidden sm:block">Education</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary-500',
                  pathname.startsWith(href) ? 'text-primary-500' : 'text-gray-600',
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Đăng nhập</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Đăng ký</Button>
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
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50',
                  )}
                >
                  {label}
                </Link>
              ))}
              <div className="flex gap-2 mt-3 px-3">
                <Link href="/auth/login" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">Đăng nhập</Button>
                </Link>
                <Link href="/auth/register" className="flex-1">
                  <Button size="sm" className="w-full">Đăng ký</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
