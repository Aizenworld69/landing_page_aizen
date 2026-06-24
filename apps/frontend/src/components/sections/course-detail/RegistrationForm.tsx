'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils/format';
import { createRegistration } from '@/lib/api/registrations.api';

interface RegistrationFormProps {
  courseId: string;
  price: number;
  priceGroup: number;
}

type Plan = 'individual' | 'group';

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  company: string;
}

const INITIAL_FORM: FormState = { fullName: '', phone: '', email: '', company: '' };

export function RegistrationForm({ courseId, price, priceGroup }: RegistrationFormProps) {
  const [plan, setPlan] = useState<Plan>('individual');
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (!form.fullName.trim()) next.fullName = 'Vui lòng nhập họ tên';
    if (!form.phone.trim()) next.phone = 'Vui lòng nhập số điện thoại';
    if (!form.email.trim()) next.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Email không hợp lệ';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setIsLoading(true);
    setApiError(null);
    try {
      const result = await createRegistration({
        courseId,
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        company: form.company || undefined,
        plan,
      });
      setSuccess(result.message);
      setForm(INITIAL_FORM);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Đăng ký thất bại, thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center shadow-sm">
        <p className="text-4xl mb-4">🎉</p>
        <p className="font-bold text-green-800 text-lg mb-1">Đăng ký thành công!</p>
        <p className="text-green-700 text-sm">{success}</p>
        <button
          onClick={() => setSuccess(null)}
          className="mt-5 text-sm text-green-600 underline"
        >
          Đăng ký thêm
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-2xl overflow-hidden sticky top-20">
      {/* Header */}
      <div className="text-center pt-6 pb-4 px-6 border-b border-gray-100">
        <p className="text-sky-500 text-xs font-bold uppercase tracking-widest mb-1">ĐĂNG KÝ</p>
        <h3 className="text-2xl font-extrabold text-gray-900">Tham gia ngay</h3>
      </div>

      <div className="p-6 flex flex-col gap-4">
        {/* Plan selector label */}
        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">CHỌN GÓI ĐĂNG KÝ</p>

        {/* Individual plan */}
        <label
          className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 cursor-pointer transition-all ${
            plan === 'individual'
              ? 'border-sky-500 bg-sky-50/50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div>
            <p className="font-semibold text-gray-900 text-sm">Cá nhân (1 người)</p>
            <p className="text-gray-700 text-sm font-medium">{formatCurrency(price)}</p>
          </div>
          <input
            type="radio"
            name="plan"
            checked={plan === 'individual'}
            onChange={() => setPlan('individual')}
            className="w-4 h-4 accent-sky-500"
          />
        </label>

        {/* Group plan */}
        <label
          className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 cursor-pointer transition-all relative ${
            plan === 'group'
              ? 'border-sky-500 bg-sky-50/50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {/* HOT NHẤT badge */}
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
          <input
            type="radio"
            name="plan"
            checked={plan === 'group'}
            onChange={() => setPlan('group')}
            className="w-4 h-4 accent-sky-500"
          />
        </label>

        {/* Form fields */}
        <Input
          id="fullName"
          label="Họ và tên"
          placeholder="Nhập họ và tên"
          value={form.fullName}
          onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
          error={errors.fullName}
          required
        />
        <Input
          id="phone"
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          error={errors.phone}
          required
        />
        <Input
          id="email"
          label="Email"
          placeholder="Nhập địa chỉ email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          error={errors.email}
          required
        />
        <Input
          id="company"
          label="Công ty/Tổ chức"
          placeholder="Nhập tên công ty"
          value={form.company}
          onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
        />

        {apiError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {apiError}
          </p>
        )}

        {/* Submit */}
        <button
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

        <p className="text-xs text-center text-gray-400 leading-relaxed">
          Đăng ký đồng ý với{' '}
          <a href="/terms" className="underline hover:text-gray-600">Điều khoản dịch vụ</a>
          {' '}của chúng tôi.
        </p>
      </div>
    </div>
  );
}
