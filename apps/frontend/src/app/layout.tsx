import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
