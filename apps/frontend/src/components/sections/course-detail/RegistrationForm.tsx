'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
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
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <p className="text-3xl mb-3">🎉</p>
        <p className="font-semibold text-green-800">{success}</p>
        <button
          onClick={() => setSuccess(null)}
          className="mt-4 text-sm text-green-600 underline"
        >
          Đăng ký thêm
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sticky top-20">
      <h3 className="font-bold text-lg text-gray-900 mb-1">Đăng ký ngay</h3>
      <p className="text-sm text-gray-500 mb-5">Số lượng có hạn</p>

      {/* Plan selector */}
      <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-gray-100 rounded-xl">
        {(['individual', 'group'] as Plan[]).map((p) => (
          <button
            key={p}
            onClick={() => setPlan(p)}
            className={`py-2 rounded-lg text-sm font-semibold transition-all ${
              plan === p ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {p === 'individual' ? 'Cá nhân' : 'Nhóm'}
          </button>
        ))}
      </div>

      {/* Price */}
      <div className="text-center mb-5">
        <p className="text-2xl font-bold text-primary-500">
          {formatCurrency(plan === 'individual' ? price : priceGroup)}
        </p>
        {plan === 'group' && (
          <p className="text-xs text-green-600 mt-1">✓ Tiết kiệm hơn khi đăng ký nhóm</p>
        )}
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-3">
        <Input
          id="fullName"
          label="Họ và tên"
          placeholder="Nguyễn Văn A"
          value={form.fullName}
          onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
          error={errors.fullName}
          required
        />
        <Input
          id="phone"
          label="Số điện thoại"
          placeholder="0901234567"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          error={errors.phone}
          required
        />
        <Input
          id="email"
          label="Email"
          placeholder="email@company.com"
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          error={errors.email}
          required
        />
        <Input
          id="company"
          label="Công ty"
          placeholder="(Không bắt buộc)"
          value={form.company}
          onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
        />
      </div>

      {apiError && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {apiError}
        </p>
      )}

      <Button
        size="lg"
        className="w-full mt-5"
        isLoading={isLoading}
        onClick={handleSubmit}
      >
        Đăng ký ngay
      </Button>

      <p className="text-xs text-center text-gray-400 mt-3">
        Chúng tôi sẽ liên hệ trong vòng 24h
      </p>
    </div>
  );
}
