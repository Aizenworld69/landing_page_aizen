'use client';

import { motion } from 'framer-motion';

import { useState, useEffect, useCallback } from 'react';
import { formatCurrency } from '@/lib/utils/format';
import { createRegistration, createGroupRegistration } from '@/lib/api/registrations.api';

// ─── Types ────────────────────────────────────────────
interface CoursePlanSectionProps {
  courseId: string;
  courseTitle: string;
  price: number;
  priceGroup: number;
}

type PlanKey = 'early_bird' | 'individual' | 'group_2' | 'group_4';

interface PlanConfig {
  key: PlanKey;
  label: string;
  sublabel: string;
  pricePerPerson: number;
  totalPrice: number;
  originalTotal: number;
  memberCount: number;
  badge?: { text: string; color: string };
  icon: React.ReactNode;
  buttonLabel: string;
}

interface MemberForm {
  fullName: string;
  phone: string;
  email: string;
  company: string;
  position: string;
  referral: string;
}

interface MemberErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  referral?: string;
}

const REFERRAL_SOURCES = [
  'Cộng Đồng AI ỨNG DỤNG SALE & MARKETING',
  'Khách hàng AIZEN',
  'Người quen giới thiệu',
  'Facebook / Instagram',
  'Khác',
];

const POSITION_OPTIONS = [
  'Chủ doanh nghiệp / CEO',
  'Giám đốc / C-level',
  'Trưởng phòng / Manager',
  'Team Lead',
  'Chuyên viên / Nhân viên',
  'Freelancer / Tự kinh doanh',
  'Sinh viên',
  'Khác',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyMember = (): MemberForm => ({
  fullName: '', phone: '', email: '', company: '', position: '', referral: '',
});
const emptyErrors = (): MemberErrors => ({});

// ─── Icon helpers ─────────────────────────────────────
const IconUser = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const IconUsers = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconBolt = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

// ─── Dark input ───────────────────────────────────────
interface DarkInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}
function DarkInput({ label, error, id, required, ...props }: DarkInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-slate-300">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input id={id} {...props}
        style={{ color: '#ffffff', caretColor: '#ffffff', WebkitTextFillColor: '#ffffff' }}
        className={`w-full px-3 py-2 rounded-lg border bg-slate-700/60 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/60 transition-colors ${
          error ? 'border-red-400/60' : 'border-white/15 hover:border-white/25'
        }`} />
      {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}

// ─── Dark select ──────────────────────────────────────
interface DarkSelectProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  onChange: (v: string) => void;
}
function DarkSelect({ id, label, value, options, placeholder = 'Chọn...', required, error, onChange }: DarkSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-slate-300">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}
          style={{ color: value === '' ? 'rgb(100,116,139)' : '#ffffff' }}
          className={`w-full appearance-none px-3 py-2 pr-8 border rounded-lg bg-slate-700/60 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/60 transition-colors ${
            error ? 'border-red-400/60' : 'border-white/15 hover:border-white/25'
          } ${value === '' ? 'text-slate-500' : 'text-white'}`}>
          <option value="" disabled className="bg-slate-900">{placeholder}</option>
          {options.map((o) => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
      {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}

// ─── Registration Modal ───────────────────────────────
interface RegistrationModalProps {
  plan: PlanConfig;
  courseId: string;
  courseTitle: string;
  onClose: () => void;
}

function RegistrationModal({ plan, courseId, courseTitle, onClose }: RegistrationModalProps) {
  const [members, setMembers] = useState<MemberForm[]>(
    Array.from({ length: plan.memberCount }, emptyMember),
  );
  const [memberErrors, setMemberErrors] = useState<MemberErrors[]>(
    Array.from({ length: plan.memberCount }, emptyErrors),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ESC to close
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);
  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  function updateMember(idx: number, field: keyof MemberForm, value: string) {
    setMembers((prev) => prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m)));
    const errorFields: (keyof MemberErrors)[] = ['fullName', 'phone', 'email', 'referral'];
    if (errorFields.includes(field as keyof MemberErrors)) {
      setMemberErrors((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: undefined } : e)));
    }
  }

  function validate(): boolean {
    let valid = true;
    const errors = members.map((m) => {
      const e: MemberErrors = {};
      if (!m.fullName.trim()) { e.fullName = 'Vui lòng nhập họ tên'; valid = false; }
      if (!m.phone.trim()) { e.phone = 'Vui lòng nhập số điện thoại'; valid = false; }
      if (!m.email.trim()) { e.email = 'Vui lòng nhập email'; valid = false; }
      else if (!EMAIL_REGEX.test(m.email)) { e.email = 'Email không hợp lệ'; valid = false; }
      if (!m.referral) { e.referral = 'Vui lòng chọn nguồn'; valid = false; }
      return e;
    });
    setMemberErrors(errors);
    return valid;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setIsLoading(true);
    setApiError(null);
    try {
      if (plan.memberCount === 1) {
        const m = members[0]!;
        await createRegistration({
          courseId, plan: plan.key === 'early_bird' ? 'individual' : 'individual',
          fullName: m.fullName, phone: m.phone, email: m.email,
          company: m.company || undefined, position: m.position || undefined,
          referral: m.referral,
        });
      } else {
        await createGroupRegistration({
          courseId,
          referral: members[0]!.referral, // primary referral from first member
          members: members.map((m) => ({
            fullName: m.fullName, phone: m.phone, email: m.email,
            company: m.company || undefined, position: m.position || undefined,
          })),
        });
      }
      setSuccess(true);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Đăng ký thất bại, thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  }

  const discount = plan.originalTotal - plan.totalPrice;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundImage: "linear-gradient(180deg, rgba(15,30,53,0.75) 0%, rgba(11,22,40,0.8) 100%), url('/backgoundTrangkhoahoc.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>

        {/* Header */}
        <div className="flex-shrink-0 px-6 pt-5 pb-4 border-b border-white/8">
          <p className="text-sky-400 text-[10px] font-bold uppercase tracking-widest mb-1">ĐĂNG KÝ THAM GIA</p>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-white">{plan.label}</h2>
              {plan.memberCount > 1 && (
                <p className="text-slate-400 text-sm mt-0.5">
                  Điền thông tin cho {plan.memberCount} học viên
                </p>
              )}
              <p className="text-slate-500 text-xs mt-1">📚 {courseTitle}</p>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/30 transition-colors flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {success ? (
            <div className="text-center py-10">
              <p className="text-5xl mb-4">🎉</p>
              <p className="text-white font-bold text-lg mb-2">Đăng ký thành công!</p>
              <p className="text-slate-300 text-sm mb-1">Chúng tôi sẽ liên hệ với bạn trong 24h.</p>
              <button onClick={onClose}
                className="mt-6 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-colors">
                Đóng
              </button>
            </div>
          ) : (
            <>
              {/* Person forms */}
              {members.map((member, idx) => (
                <div key={idx}
                  className="rounded-xl border border-white/8 bg-white/3 p-4 space-y-3">
                  {/* Person label */}
                  {plan.memberCount > 1 && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <p className="text-sm font-semibold text-white">Người {idx + 1}</p>
                    </div>
                  )}

                  {/* Row 1: Name + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DarkInput id={`fullName_${idx}`} label="Họ và Tên" placeholder="Nguyễn Văn A"
                      value={member.fullName} error={memberErrors[idx]?.fullName} required
                      onChange={(e) => updateMember(idx, 'fullName', e.target.value)} />
                    <DarkInput id={`phone_${idx}`} label="Số điện thoại" placeholder="090 xxx xxx"
                      type="tel" value={member.phone} error={memberErrors[idx]?.phone} required
                      onChange={(e) => updateMember(idx, 'phone', e.target.value)} />
                  </div>

                  {/* Row 2: Email + Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DarkInput id={`email_${idx}`} label="Email" placeholder="email@example.com"
                      type="email" value={member.email} error={memberErrors[idx]?.email} required
                      onChange={(e) => updateMember(idx, 'email', e.target.value)} />
                    <DarkInput id={`company_${idx}`} label="Tên Công Ty" placeholder="Công ty của bạn"
                      value={member.company}
                      onChange={(e) => updateMember(idx, 'company', e.target.value)} />
                  </div>

                  {/* Row 3: Position + Referral */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DarkSelect id={`position_${idx}`} label="Chức vụ" value={member.position}
                      options={POSITION_OPTIONS} placeholder="Chọn vị trí..."
                      onChange={(v) => updateMember(idx, 'position', v)} />
                    <DarkSelect id={`referral_${idx}`} label="Bạn biết đến chương trình từ đâu"
                      value={member.referral} options={REFERRAL_SOURCES}
                      placeholder="Chọn nguồn..." required
                      error={memberErrors[idx]?.referral}
                      onChange={(v) => updateMember(idx, 'referral', v)} />
                  </div>
                </div>
              ))}

              {/* Price summary */}
              <div className="rounded-xl border border-white/8 bg-white/3 px-4 py-3 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Giá gốc:</span>
                  <span className="text-slate-500 line-through">{formatCurrency(plan.originalTotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Giảm giá ({plan.label}):</span>
                    <span className="text-emerald-400 font-semibold">-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="border-t border-white/8 pt-2 flex justify-between items-center">
                  <span className="text-white font-semibold text-sm">Tổng thanh toán:</span>
                  <span className="text-sky-300 font-extrabold text-lg">{formatCurrency(plan.totalPrice)}</span>
                </div>
              </div>

              {apiError && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5">
                  {apiError}
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer — submit button */}
        {!success && (
          <div className="flex-shrink-0 px-6 pb-5 pt-3 border-t border-white/8 space-y-2">
            <button onClick={handleSubmit} disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white font-bold text-base transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {isLoading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>Đang xử lý...</>
              ) : (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>Gửi đăng ký</>
              )}
            </button>
            <p className="text-center text-xs text-slate-500">
              Chúng tôi sẽ liên hệ với bạn qua điện thoại trong 24h.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Plan Card ────────────────────────────────────────
interface PlanCardProps {
  plan: PlanConfig;
  onClick: () => void;
}

function PlanCard({ plan, onClick }: PlanCardProps) {
  const isEarlyBird = plan.key === 'early_bird';
  const isGroup4 = plan.key === 'group_4';
  const isGroup2 = plan.key === 'group_2';

  const getBadgeGradient = () => {
    if (plan.badge?.color.includes('amber')) return 'linear-gradient(90deg, #d97706, #f59e0b)';
    if (plan.badge?.color.includes('emerald')) return 'linear-gradient(90deg, #059669, #10b981)';
    return 'linear-gradient(90deg, #0284c7, #0ea5e9)';
  };

  const getCardBorder = () => {
    if (isEarlyBird) return 'rgba(245,158,11,0.2)';
    if (isGroup4) return 'rgba(16,185,129,0.3)';
    if (isGroup2) return 'rgba(14,165,233,0.3)';
    return 'rgba(255,255,255,0.1)';
  };

  const getCardGlow = () => {
    if (isGroup4) return '0 8px 24px rgba(16,185,129,0.12)';
    if (isGroup2) return '0 8px 24px rgba(14,165,233,0.12)';
    return 'none';
  };

  return (
    <div
      className={`relative flex flex-col rounded-2xl overflow-hidden h-full ${
        isEarlyBird ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer group'
      }`}
      style={{
        background: isEarlyBird
          ? 'rgba(15,25,40,0.6)'
          : 'rgba(15,28,48,0.8)',
        border: `1px solid ${getCardBorder()}`,
        boxShadow: getCardGlow(),
        backdropFilter: 'blur(8px)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        minHeight: 200,
      }}
      onClick={isEarlyBird ? undefined : onClick}
      onMouseEnter={(e) => {
        if (isEarlyBird) return;
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(-5px)';
        if (isGroup4) el.style.boxShadow = '0 12px 32px rgba(16,185,129,0.2)';
        else if (isGroup2) el.style.boxShadow = '0 12px 32px rgba(14,165,233,0.2)';
        else el.style.boxShadow = '0 12px 32px rgba(14,165,233,0.15)';
      }}
      onMouseLeave={(e) => {
        if (isEarlyBird) return;
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = getCardGlow();
      }}
    >
      {/* Badge strip */}
      {plan.badge && (
        <div
          className="py-1.5 text-center text-[10px] font-black uppercase tracking-[0.15em] text-white"
          style={{ background: getBadgeGradient() }}
        >
          {plan.badge.text}
        </div>
      )}

      <div className={`flex flex-col flex-1 p-5 ${plan.badge ? 'pt-4' : 'pt-5'}`}>
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
          style={{
            background: isEarlyBird
              ? 'rgba(245,158,11,0.12)'
              : isGroup4
              ? 'rgba(16,185,129,0.12)'
              : 'rgba(14,165,233,0.12)',
          }}
        >
          {plan.icon}
        </div>

        {/* Name */}
        <p className="font-black text-white text-base mb-0.5 tracking-tight">{plan.label}</p>
        <p className="text-slate-500 text-xs mb-4">{plan.sublabel}</p>

        {/* Price */}
        <div className="mt-auto">
          {plan.originalTotal > plan.totalPrice && (
            <p className="text-slate-600 line-through text-xs mb-0.5">
              {formatCurrency(plan.originalTotal)}
            </p>
          )}
          <p
            className="font-black text-xl mb-4 leading-tight"
            style={{
              color: isEarlyBird
                ? '#fcd34d'
                : isGroup4
                ? '#34d399'
                : '#f8fafc',
            }}
          >
            {formatCurrency(plan.totalPrice)}
          </p>

          {isEarlyBird ? (
            <div className="w-full py-2.5 rounded-xl border border-white/10 text-slate-500 text-xs font-semibold text-center">
              Đã hết hạn đăng ký
            </div>
          ) : (
            <button
              className="w-full py-2.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-1.5 transition-all"
              style={{
                background: isGroup4
                  ? 'linear-gradient(90deg, #059669, #10b981)'
                  : 'linear-gradient(90deg, #0284c7, #0ea5e9)',
                boxShadow: isGroup4
                  ? '0 4px 12px rgba(16,185,129,0.3)'
                  : '0 4px 12px rgba(14,165,233,0.3)',
              }}
              onClick={(e) => { e.stopPropagation(); onClick(); }}
            >
              {plan.buttonLabel}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────
export function CoursePlanSection({ courseId, courseTitle, price, priceGroup }: CoursePlanSectionProps) {
  const earlyBirdPrice = Math.round(price * 0.73);
  const group4Total = courseId === '9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f' || price === 1300000
    ? 3800000
    : Math.round((priceGroup - 150000) * 4);

  const PLANS: PlanConfig[] = [
    {
      key: 'early_bird',
      label: 'Early Bird',
      sublabel: '1 người · Ưu đãi có hạn',
      pricePerPerson: earlyBirdPrice,
      totalPrice: earlyBirdPrice,
      originalTotal: price,
      memberCount: 1,
      badge: { text: 'SỐ LƯỢNG CÓ HẠN', color: 'bg-amber-500' },
      icon: <IconBolt className="w-5 h-5 text-amber-400" />,
      buttonLabel: 'Đăng ký ngay',
    },
    {
      key: 'individual',
      label: '1 người',
      sublabel: 'Đăng ký cá nhân',
      pricePerPerson: price,
      totalPrice: price,
      originalTotal: price,
      memberCount: 1,
      icon: <IconUser className="w-5 h-5 text-sky-400" />,
      buttonLabel: 'Đăng ký ngay',
    },
    {
      key: 'group_2',
      label: 'Nhóm 2 người',
      sublabel: `${formatCurrency(priceGroup)}/người`,
      pricePerPerson: priceGroup,
      totalPrice: priceGroup * 2,
      originalTotal: price * 2,
      memberCount: 2,
      badge: { text: 'HOT NHẤT', color: 'bg-sky-500' },
      icon: <IconUsers className="w-5 h-5 text-sky-400" />,
      buttonLabel: 'Đăng ký ngay',
    },
    {
      key: 'group_4',
      label: 'Nhóm 4 người',
      sublabel: `${formatCurrency(Math.round(group4Total / 4))}/người`,
      pricePerPerson: Math.round(group4Total / 4),
      totalPrice: group4Total,
      originalTotal: price * 4,
      memberCount: 4,
      badge: { text: `TIẾT KIỆM ${Math.round(((price * 4 - group4Total) / (price * 4)) * 100)}%`, color: 'bg-emerald-500' },
      icon: <IconUsers className="w-5 h-5 text-emerald-400" />,
      buttonLabel: 'Đăng ký nhóm',
    },
  ];

  const [activePlan, setActivePlan] = useState<PlanConfig | null>(null);

  return (
    <>
      <section id="dang-ky" className="py-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.2em] text-[#38bdf8] uppercase mb-3">
            <span className="w-6 h-px bg-[#38bdf8]/60" />
            ĐĂNG KÝ NGAY
            <span className="w-6 h-px bg-[#38bdf8]/60" />
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Chọn hình thức{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#3b82f6]">
              đăng ký
            </span>
          </h2>
        </motion.div>

        {/* 4 plan cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <PlanCard plan={plan} onClick={() => setActivePlan(plan)} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {activePlan && (
        <RegistrationModal
          plan={activePlan}
          courseId={courseId}
          courseTitle={courseTitle}
          onClose={() => setActivePlan(null)}
        />
      )}
    </>
  );
}
