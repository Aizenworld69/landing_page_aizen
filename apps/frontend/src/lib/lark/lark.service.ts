/**
 * Lark Open API Service (server-side only)
 * Docs: https://open.larksuite.com/document/server-docs/im-v1/message/create
 */

const LARK_API_BASE = 'https://open.larksuite.com/open-apis';

interface TenantTokenResponse {
  code: number;
  msg: string;
  tenant_access_token: string;
  expire: number;
}

interface SendMessageResponse {
  code: number;
  msg: string;
  data: {
    message_id: string;
  };
}

/**
 * Lấy tenant_access_token từ Lark (có hiệu lực 2 giờ)
 * Dùng App ID + App Secret từ Lark Open Platform
 */
async function getTenantAccessToken(): Promise<string> {
  const appId = process.env.LARK_APP_ID;
  const appSecret = process.env.LARK_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error('[Lark] Thiếu LARK_APP_ID hoặc LARK_APP_SECRET trong env');
  }

  const res = await fetch(`${LARK_API_BASE}/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  });

  if (!res.ok) {
    throw new Error(`[Lark] Không lấy được token: HTTP ${res.status}`);
  }

  const json = (await res.json()) as TenantTokenResponse;

  if (json.code !== 0) {
    throw new Error(`[Lark] Token error: ${json.msg} (code: ${json.code})`);
  }

  return json.tenant_access_token;
}

export interface LarkRegistrationPayload {
  fullName: string;
  phone: string;
  email: string;
  company?: string;
  plan: 'individual' | 'group';
  courseTitle: string;
  courseId: string;
}

/**
 * Gửi thông báo đăng ký khóa học vào Lark group chat
 */
export async function sendRegistrationNotification(
  payload: LarkRegistrationPayload,
): Promise<void> {
  const chatId = process.env.LARK_CHAT_ID;

  if (!chatId) {
    throw new Error('[Lark] Thiếu LARK_CHAT_ID trong env');
  }

  const token = await getTenantAccessToken();

  const planLabel = payload.plan === 'group' ? '👥 Nhóm 2 người' : '👤 Cá nhân';
  const companyLine = payload.company ? `🏢 Công ty: ${payload.company}` : '';

  const messageText = [
    '🎉 *Đăng ký mới!*',
    `📚 Khóa học: *${payload.courseTitle}*`,
    `─────────────────`,
    `👤 Họ tên: ${payload.fullName}`,
    `📱 SĐT: ${payload.phone}`,
    `📧 Email: ${payload.email}`,
    companyLine,
    `🎫 Gói: ${planLabel}`,
    `─────────────────`,
    `🆔 Course ID: ${payload.courseId}`,
    `🕐 Thời gian: ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
  ]
    .filter(Boolean)
    .join('\n');

  const res = await fetch(`${LARK_API_BASE}/im/v1/messages?receive_id_type=chat_id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      receive_id: chatId,
      msg_type: 'text',
      content: JSON.stringify({ text: messageText }),
    }),
  });

  if (!res.ok) {
    throw new Error(`[Lark] Gửi message thất bại: HTTP ${res.status}`);
  }

  const json = (await res.json()) as SendMessageResponse;

  if (json.code !== 0) {
    throw new Error(`[Lark] Message error: ${json.msg} (code: ${json.code})`);
  }
}
