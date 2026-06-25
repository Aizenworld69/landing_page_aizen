'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils/format';
import { createRegistration, createGroupRegistration } from '@/lib/api/registrations.api';

// ─── Types ───────────────────────────────────────────
interface RegistrationFormProps {
  courseId: string;
  price: number;
  priceGroup: number;
}

type Plan = 'individual' | 'group';

interface MemberForm {
  fullName: string;
  phone: string;
  email: string;
  company: string;
  position: string;
}

interface MemberErrors {
  fullName?: string;
  phone?: string;
  email?: string;
}

const REFERRAL_SOURCES = [
  'Cộng Đồng AI ỨNG DỤNG SALE & MARKETING',
  'Khách hàng AIZEN',
  'Người quen giới thiệu',
  'Facebook / Instagram',
  'Khác',
];

const emptyMember = (): MemberForm => ({
  fullName: '',
  phone: '',
  email: '',
  company: '',
  position: '',
});

const emptyMemberErrors = (): MemberErrors => ({});
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Step indicator (chỉ hiện khi nhóm) ─────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-1">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center">
          {/* Circle */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
              i < current
                ? 'bg-sky-500 border-sky-500 text-white'
                : i === current
                ? 'bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-200'
                : 'bg-white border-gray-200 text-gray-400'
            }`}
          >
            {i < current ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          {/* Line between steps */}
          {i < total - 1 && (
            <div
              className={`w-12 h-0.5 transition-all duration-300 ${
                i < current ? 'bg-sky-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Person form fields ───────────────────────────────
interface PersonSectionProps {
  index: number;
  member: MemberForm;
  errors: MemberErrors;
  onChange: (field: keyof MemberForm, value: string) => void;
}

function PersonSection({ index, member, errors, onChange }: PersonSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        id={`fullName_${index}`}
        label="Họ và tên"
        placeholder="Nhập họ và tên"
        value={member.fullName}
        onChange={(e) => onChange('fullName', e.target.value)}
        error={errors.fullName}
        required
      />
      <Input
        id={`phone_${index}`}
        label="Số điện thoại"
        placeholder="Nhập số điện thoại"
        type="tel"
        value={member.phone}
        onChange={(e) => onChange('phone', e.target.value)}
        error={errors.phone}
        required
      />
      <Input
        id={`email_${index}`}
        label="Email"
        placeholder="Nhập địa chỉ email"
        type="email"
        value={member.email}
        onChange={(e) => onChange('email', e.target.value)}
        error={errors.email}
        required
      />
      <Input
        id={`company_${index}`}
        label="Công ty/Tổ chức"
        placeholder="Nhập tên công ty"
        value={member.company}
        onChange={(e) => onChange('company', e.target.value)}
      />
      <Input
        id={`position_${index}`}
        label="Chức vụ"
        placeholder="VD: Giám đốc, Trưởng phòng, Nhân viên..."
        value={member.position}
        onChange={(e) => onChange('position', e.target.value)}
      />
    </div>
  );
}

// ─── Referral dropdown ────────────────────────────────
interface ReferralSelectProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

function ReferralSelect({ value, error, onChange }: ReferralSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="referral" className="text-sm font-medium text-gray-700">
        Bạn biết đến chương trình từ đâu <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <select
          id="referral"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none px-4 py-2.5 pr-10 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
            error ? 'border-red-400' : 'border-gray-200 focus:border-sky-400'
          } ${value === '' ? 'text-gray-400' : 'text-gray-900'}`}
        >
          <option value="" disabled>Chọn nguồn...</option>
          {REFERRAL_SOURCES.map((src) => (
            <option key={src} value={src}>{src}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────
export function RegistrationForm({ courseId, price, priceGroup }: RegistrationFormProps) {
  const [plan, setPlan] = useState<Plan>('individual');
  // step: 0 = người 1 (hoặc duy nhất nếu individual), 1 = người 2
  const [step, setStep] = useState(0);
  const [members, setMembers] = useState<MemberForm[]>([emptyMember(), emptyMember()]);
  const [memberErrors, setMemberErrors] = useState<MemberErrors[]>([emptyMemberErrors(), emptyMemberErrors()]);
  const [referral, setReferral] = useState('');
  const [referralError, setReferralError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const isGroup = plan === 'group';
  const totalSteps = isGroup ? 2 : 1;
  // Với individual, referral hiện ở step 0; với group, hiện ở step 1 (bước cuối)
  const showReferral = !isGroup || step === 1;

  // ── Plan change → reset ──────────────────────────────
  function handlePlanChange(newPlan: Plan) {
    setPlan(newPlan);
    setStep(0);
    setMembers([emptyMember(), emptyMember()]);
    setMemberErrors([emptyMemberErrors(), emptyMemberErrors()]);
    setReferral('');
    setReferralError(undefined);
    setApiError(null);
  }

  // ── Update member field ──────────────────────────────
  function updateMember(idx: number, field: keyof MemberForm, value: string) {
    setMembers((prev) => prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m)));
    // Clear field error khi user gõ
    if (field in { fullName: 1, phone: 1, email: 1 }) {
      setMemberErrors((prev) =>
        prev.map((e, i) => (i === idx ? { ...e, [field]: undefined } : e)),
      );
    }
  }

  // ── Validate current step ────────────────────────────
  function validateStep(idx: number): boolean {
    const m = members[idx]!;
    const e: MemberErrors = {};
    if (!m.fullName.trim()) e.fullName = 'Vui lòng nhập họ tên';
    if (!m.phone.trim()) e.phone = 'Vui lòng nhập số điện thoại';
    if (!m.email.trim()) e.email = 'Vui lòng nhập email';
    else if (!EMAIL_REGEX.test(m.email)) e.email = 'Email không hợp lệ';

    setMemberErrors((prev) => prev.map((old, i) => (i === idx ? e : old)));
    return Object.keys(e).length === 0;
  }

  // ── "Tiếp tục" → sang bước kế ───────────────────────
  function handleNext() {
    if (!validateStep(step)) return;
    setApiError(null);
    setStep(1);
  }

  // ── Submit ───────────────────────────────────────────
  async function handleSubmit() {
    const currentValid = validateStep(step);
    let refValid = true;
    if (!referral) { setReferralError('Vui lòng chọn nguồn'); refValid = false; }
    else setReferralError(undefined);
    if (!currentValid || !refValid) return;

    setIsLoading(true);
    setApiError(null);
    try {
      let message: string;

      if (!isGroup) {
        const m = members[0]!;
        const result = await createRegistration({
          courseId,
          fullName: m.fullName,
          phone: m.phone,
          email: m.email,
          company: m.company || undefined,
          position: m.position || undefined,
          referral,
          plan: 'individual',
        });
        message = result.message;
      } else {
        const result = await createGroupRegistration({
          courseId,
          referral,
          members: members.map((m) => ({
            fullName: m.fullName,
            phone: m.phone,
            email: m.email,
            company: m.company || undefined,
            position: m.position || undefined,
          })),
        });
        message = result.message;
      }

      setSuccess(message);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Đăng ký thất bại, thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  }

  // ─── Success screen ───────────────────────────────────
  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center shadow-sm">
        <p className="text-4xl mb-4">🎉</p>
        <p className="font-bold text-green-800 text-lg mb-1">Đăng ký thành công!</p>
        <p className="text-green-700 text-sm">{success}</p>
        <button
          onClick={() => { setSuccess(null); handlePlanChange('individual'); }}
          className="mt-5 text-sm text-green-600 underline"
        >
          Đăng ký thêm
        </button>
      </div>
    );
  }

  // ─── Main form ────────────────────────────────────────
  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-2xl overflow-hidden sticky top-20">
      {/* Header */}
      <div className="text-center pt-6 pb-4 px-6 border-b border-gray-100">
        <p className="text-sky-500 text-xs font-bold uppercase tracking-widest mb-1">ĐĂNG KÝ</p>
        <h3 className="text-2xl font-extrabold text-gray-900">Tham gia ngay</h3>
      </div>

      <div className="p-6 flex flex-col gap-5">
        {/* ── Plan selector ── */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">CHỌN GÓI ĐĂNG KÝ</p>
          {/* Individual */}
          <label
            className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 cursor-pointer transition-all ${
              plan === 'individual' ? 'border-sky-500 bg-sky-50/50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div>
              <p className="font-semibold text-gray-900 text-sm">Cá nhân (1 người)</p>
              <p className="text-gray-700 text-sm font-medium">{formatCurrency(price)}</p>
            </div>
            <input type="radio" name="plan" checked={plan === 'individual'}
              onChange={() => handlePlanChange('individual')} className="w-4 h-4 accent-sky-500" />
          </label>
          {/* Group */}
          <label
            className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 cursor-pointer transition-all relative ${
              plan === 'group' ? 'border-sky-500 bg-sky-50/50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-sky-500 text-white text-[10px] font-bold rounded uppercase tracking-wide">
              HOT NHẤT
            </span>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Nhóm 2 người</p>
              <p className="text-sm">
                <span className="font-bold text-gray-900">{formatCurrency(priceGroup)}</span>
                <span className="text-gray-400 line-through text-xs ml-2">{formatCurrency(price * 2)}</span>
              </p>
            </div>
            <input type="radio" name="plan" checked={plan === 'group'}
              onChange={() => handlePlanChange('group')} className="w-4 h-4 accent-sky-500" />
          </label>
        </div>

        <div className="border-t border-gray-100" />

        {/* ── Step indicator (chỉ khi nhóm) ── */}
        {isGroup && (
          <div className="flex flex-col items-center gap-1">
            <StepIndicator current={step} total={totalSteps} />
            <p className="text-xs text-gray-400">
              Thông tin người {step + 1} / {totalSteps}
            </p>
          </div>
        )}

        {/* ── Person form (animated slide) ── */}
        <div key={`step-${step}`} className="flex flex-col gap-3 animate-fade-in">
          {/* Label người X khi nhóm */}
          {isGroup && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {step + 1}
              </div>
              <p className="text-sm font-semibold text-gray-700">Thông tin người {step + 1}</p>
            </div>
          )}

          <PersonSection
            index={step}
            member={members[step]!}
            errors={memberErrors[step]!}
            onChange={(field, value) => updateMember(step, field, value)}
          />
        </div>

        {/* ── Referral (hiện ở bước cuối) ── */}
        {showReferral && (
          <ReferralSelect
            value={referral}
            error={referralError}
            onChange={(v) => { setReferral(v); setReferralError(undefined); }}
          />
        )}

        {/* ── API error ── */}
        {apiError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {apiError}
          </p>
        )}

        {/* ── Action buttons ── */}
        {isGroup && step === 0 ? (
          /* Bước 1 nhóm → nút Tiếp tục */
          <button
            onClick={handleNext}
            className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold text-base transition-colors flex items-center justify-center gap-2"
          >
            Tiếp tục
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          /* Bước cuối → nút Đăng ký + nút Quay lại (chỉ khi nhóm) */
          <div className="flex flex-col gap-2">
            <button
              id="btn-register-submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                'Đăng ký ngay'
              )}
            </button>

            {isGroup && (
              <button
                onClick={() => { setStep(0); setApiError(null); }}
                className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại người 1
              </button>
            )}
          </div>
        )}

        <p className="text-xs text-center text-gray-400 leading-relaxed">
          Đăng ký đồng ý với{' '}
          <a href="/terms" className="underline hover:text-gray-600">Điều khoản dịch vụ</a>
          {' '}của chúng tôi.
        </p>
      </div>
    </div>
  );
}
