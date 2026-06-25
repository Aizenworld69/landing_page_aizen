import { NextRequest, NextResponse } from 'next/server';
import { sendRegistrationNotification } from '@/lib/lark/lark.service';
import type { LarkRegistrationPayload } from '@/lib/lark/lark.service';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LarkRegistrationPayload;

    // Validate basic fields
    if (!body.fullName || !body.phone || !body.email || !body.courseId) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    await sendRegistrationNotification(body);

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi không xác định';
    console.error('[POST /api/lark/notify]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
