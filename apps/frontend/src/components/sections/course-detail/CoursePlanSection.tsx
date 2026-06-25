'use client';

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
        className={`w-full px-3 py-2 rounded-lg border bg-white/8 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/60 transition-colors ${
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
          className={`w-full appearance-none px-3 py-2 pr-8 border rounded-lg bg-white/8 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/60 transition-colors ${
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
        style={{ background: 'linear-gradient(180deg, #0F1E35 0%, #0B1628 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>

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
  return (
    <div className={`relative flex flex-col rounded-2xl border transition-all duration-200 overflow-hidden ${
      isEarlyBird
        ? 'border-white/8 bg-white/3 opacity-80'
        : 'border-white/10 bg-white/5 hover:border-sky-500/50 hover:bg-sky-500/5 hover:-translate-y-1 cursor-pointer hover:shadow-lg hover:shadow-sky-500/10'
    }`}
      onClick={isEarlyBird ? undefined : onClick}
      style={{ minHeight: 200 }}
    >
      {plan.badge && (
        <div className={`absolute top-0 inset-x-0 py-1 text-center text-[10px] font-bold uppercase tracking-wider text-white ${plan.badge.color}`}>
          {plan.badge.text}
        </div>
      )}

      <div className={`flex flex-col flex-1 p-5 ${plan.badge ? 'pt-8' : 'pt-5'}`}>
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
          isEarlyBird ? 'bg-amber-500/15' : 'bg-sky-500/15'
        }`}>
          {plan.icon}
        </div>

        {/* Name */}
        <p className="font-bold text-white text-base mb-0.5">{plan.label}</p>
        <p className="text-slate-400 text-xs mb-4">{plan.sublabel}</p>

        {/* Price */}
        <div className="mt-auto">
          {plan.originalTotal > plan.totalPrice && (
            <p className="text-slate-500 line-through text-xs mb-0.5">
              {formatCurrency(plan.originalTotal)}
            </p>
          )}
          <p className={`font-extrabold text-xl mb-4 ${isEarlyBird ? 'text-amber-300' : 'text-white'}`}>
            {formatCurrency(plan.totalPrice)}<span className="text-sm font-normal text-slate-400">đ</span>
          </p>

          {isEarlyBird ? (
            <div className="w-full py-2.5 rounded-xl border border-white/15 text-slate-400 text-sm font-semibold text-center">
              Đã hết hạn đăng ký
            </div>
          ) : (
            <button
              className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold transition-colors flex items-center justify-center gap-1.5"
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
  const group4Total = Math.round(priceGroup * 1.8);

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
      badge: { text: 'TIẾT KIỆM 24%', color: 'bg-emerald-500' },
      icon: <IconUsers className="w-5 h-5 text-emerald-400" />,
      buttonLabel: 'Đăng ký nhóm',
    },
  ];

  const [activePlan, setActivePlan] = useState<PlanConfig | null>(null);

  return (
    <>
      <section id="dang-ky" className="py-12">
        {/* Heading */}
        <div className="text-center mb-8">
          <p className="text-sky-400 text-xs font-bold uppercase tracking-widest mb-2">ĐĂNG KÝ</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Chọn hình thức đăng ký
          </h2>
        </div>

        {/* 4 plan cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan) => (
            <PlanCard key={plan.key} plan={plan} onClick={() => setActivePlan(plan)} />
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
