'use client';

import { motion } from 'framer-motion';
import type { CourseWithDetails } from '@aizen/types';

interface CourseHeroProps {
  course: CourseWithDetails;
}

function formatPrice(price: number) {
  return price.toLocaleString('vi-VN') + 'đ';
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function CourseHero({ course }: CourseHeroProps) {
  const date = formatDate(course.start_date);
  const isCompleted = course.status === 'completed';

  return (
    <section className="relative pt-4 pb-10 text-white overflow-hidden">

      <div className="relative z-10">
        {/* Category + Status badge */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-4 flex-wrap"
        >
          <span className="text-xs font-black tracking-widest text-[#0EA5E9] uppercase">
            {course.category}
          </span>
          <span className="h-3 border-l border-slate-600" />
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-[#3b82f6]/20 text-[#0EA5E9] border border-[#3b82f6]/30'
            }`}
          >
            {isCompleted ? '✓ Đã hoàn thành' : '⏳ Sắp khai giảng'}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-4"
        >
          {course.title.split(' ').map((word, i) => {
            const highlighted = ['AI', 'Claude', 'Prompt', 'Data', 'Multi-Agent', 'UI'].some(k =>
              word.includes(k)
            );
            return highlighted ? (
              <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#38bdf8]">
                {word}{' '}
              </span>
            ) : (
              <span key={i}>{word} </span>
            );
          })}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed mb-8"
        >
          {course.description}
        </motion.p>

        {/* Meta stats — full width 3 col */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-3 border-y border-white/10 py-5 mb-8"
        >
          {[
            { icon: 'groups', value: '01 Ngày', label: 'Offline thực hành' },
            { icon: 'headset_mic', value: '03 Ngày', label: 'Online hỗ trợ' },
            { icon: 'all_inclusive', value: 'Học lại', label: 'Trọn đời' },
          ].map((item, i) => (
            <div key={i} className={`flex flex-col items-center text-center px-4 ${i < 2 ? 'border-r border-white/10' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0284C7] to-[#0EA5E9] flex items-center justify-center shadow-lg shadow-blue-500/20 mb-2">
                <span className="material-symbols-outlined text-white text-lg">{item.icon}</span>
              </div>
              <h3 className="text-lg font-black text-white uppercase">{item.value}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Price + Date */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-wrap items-center gap-6 text-sm"
        >
          {date && (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0EA5E9] text-lg">calendar_month</span>
              <div>
                <p className="text-white font-bold">{date}</p>
                <p className="text-slate-400 text-xs">8h30 – 17h00</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0EA5E9] text-lg">sell</span>
            <div>
              <p className="text-white font-black text-xl">{formatPrice(course.price)}</p>
              <p className="text-slate-400 text-xs">Nhóm từ {formatPrice(course.price_group)}/người</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}