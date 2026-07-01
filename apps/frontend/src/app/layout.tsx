import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'AIZEN Education — Lam Chu Tuong Lai',
    template: '%s | AIZEN Education',
  },
  description:
    'Nen tang dao tao AI thuc chien hang dau Viet Nam. Hoc tu nhung chuyen gia thuc chien, ap dung ngay vao cong viec.',
  keywords: ['AI', 'education', 'machine learning', 'deep learning', 'AIZEN'],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'AIZEN Education',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <head>
        {/* Preconnect để load nhanh hơn */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/*
          Material Symbols — không có trong next/font nên dùng link trực tiếp.
          display=swap (thay vì block) để không chặn render nội dung trang
          trong lúc chờ font tải; icon sẽ hiện ra ngay khi font sẵn sàng
          thay vì giữ trắng cả trang.
        */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
