import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * Endpoint nội bộ: backend gọi vào đây ngay sau khi admin thay đổi
 * blog/khóa học (đăng, tắt đăng, sửa, xóa) để xóa cache ISR ngay lập tức,
 * thay vì phải chờ hết thời gian revalidate (30s–300s) mới cập nhật.
 *
 * Bảo mật bằng secret dùng chung với backend (REVALIDATE_SECRET),
 * không public — chỉ backend mới gọi được.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret');

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  let paths: string[] = [];
  try {
    const body = (await req.json()) as { paths?: string[] };
    if (Array.isArray(body.paths)) paths = body.paths.filter((p) => typeof p === 'string');
  } catch {
    // body rỗng/không hợp lệ — bỏ qua
  }

  if (paths.length === 0) {
    return NextResponse.json({ message: 'Missing paths' }, { status: 400 });
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, paths, now: Date.now() });
}
