'use client';

import { motion } from 'framer-motion';
import type { CourseWithDetails } from '@aizen/types';

interface CourseSkillsProps {
  skills?: CourseWithDetails['skills'];
}

const DEFAULT_SKILLS = [
  {
    id: 'cowork',
    icon: 'groups',
    label: 'Claude Cowork',
    description:
      'Cowork là cả một phòng ban AI trong lòng bàn tay – mỗi agent đảm nhận một vai trò, tự vận hành, tự phối hợp với nhau, và giao cho bạn kết quả cuối cùng như một đội ngũ thực thụ.',
    featured: true,
    badge: 'ĐẶC BIỆT',
  },
  {
    id: 'skills',
    icon: 'psychology',
    label: 'Claude Skills',
    description:
      'Biến mỗi nhân sự hoặc quy trình công ty thành Skill cố định – gọi một lúc nhiều Skills, Claude tự xử lý đa nhiệm mà không cần ra lệnh lại.',
  },
  {
    id: 'projects',
    icon: 'folder_open',
    label: 'Claude Projects',
    description:
      'Giao việc cho đúng người, giúp bạn tạo ra những "chuyên gia ảo" theo từng lĩnh vực, luôn hiểu đúng context và làm việc theo chuẩn của bạn.',
  },
  {
    id: 'connectors',
    icon: 'hub',
    label: 'Claude Connectors',
    description:
      'Chìa khóa để Claude kết nối với hệ thống công việc như Gmail, Google Drive, Calendar... để xây dựng các trợ lý tự động.',
  },
  {
    id: 'artifacts',
    icon: 'layers',
    label: 'Claude Artifacts',
    description:
      'Xây luôn cho bạn một app, website, landing page hay công cụ tương tác ngay trong khung chat, không cần code.',
  },
];

export function CourseSkills({ skills }: CourseSkillsProps) {
  const items =
    skills && skills.length > 0
      ? skills.map((s, i) => ({
          id: `skill-${i}`,
          icon: ['groups', 'psychology', 'folder_open', 'hub', 'layers'][i % 5],
          label: s.title,
          description: s.description,
          featured: i === 0,
          badge: s.badge,
        }))
      : DEFAULT_SKILLS;

  const [featured, ...rest] = items;

  return (
    <section className="mb-14">
      {/* Section header — căn trái, nhất quán với các section khác */}
      <p className="text-xs font-black tracking-widest text-[#3b82f6] uppercase mb-2">
        KỸ NĂNG BẠN SẼ CÓ
      </p>
      <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-8">
        Kết thúc khóa học<br />bạn sở hữu ngay
      </h2>

      {/* Row 1: featured (span 2) + 2 cards = 4 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {/* Featured */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -4 }}
          className="lg:col-span-2 bg-gradient-to-br from-[#3b82f6]/20 to-[#38bdf8]/10 border border-[#3b82f6]/30 rounded-3xl p-7 shadow-xl flex flex-col items-center justify-center min-h-[240px] text-center relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1a4cd2] to-[#3b82f6] text-white flex items-center justify-center mb-4 shadow-md shadow-blue-500/10">
            <span className="material-symbols-outlined text-2xl">{featured.icon}</span>
          </div>
          {featured.badge && (
            <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase rounded-full tracking-wider mb-3">
              {featured.badge}
            </span>
          )}
          <h3 className="text-xl font-black mb-3 text-[#3b82f6]">{featured.label}</h3>
          <p className="text-blue-100 text-sm leading-relaxed">{featured.description}</p>
        </motion.div>

        {/* Cards 2 + 3 */}
        {rest.slice(0, 2).map((skill, idx) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (idx + 1) * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-[#0f2133] border border-white/8 hover:border-[#3b82f6]/30 rounded-3xl p-7 shadow-lg flex flex-col items-center justify-center min-h-[240px] text-center transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1a4cd2] to-[#3b82f6] text-white flex items-center justify-center mb-4 shadow-md shadow-blue-500/10">
              <span className="material-symbols-outlined text-2xl">{skill.icon}</span>
            </div>
            <h3 className="text-lg font-black text-[#3b82f6] mb-3 tracking-tight">{skill.label}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{skill.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Row 2: 2 cards căn giữa */}
      {rest.length > 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {rest.slice(2).map((skill, idx) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-[#0f2133] border border-white/8 hover:border-[#3b82f6]/30 rounded-3xl p-7 shadow-lg flex flex-col items-center justify-center min-h-[180px] text-center transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1a4cd2] to-[#3b82f6] text-white flex items-center justify-center mb-4 shadow-md shadow-blue-500/10">
                <span className="material-symbols-outlined text-2xl">{skill.icon}</span>
              </div>
              <h3 className="text-lg font-black text-[#3b82f6] mb-3 tracking-tight">{skill.label}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{skill.description}</p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}