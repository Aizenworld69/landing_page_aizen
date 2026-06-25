-- Migration: 005_seed_remaining_modules.sql
-- Seed modules cho 3 khóa còn thiếu: Đường ống dữ liệu, Thiết kế UI, Prompt Engineering Nâng cao
-- Chạy SAU migration 004
-- Run in Supabase SQL Editor

-- ════════════════════════════════════════════════════════════════
-- KHÓA 6: Đường ống dữ liệu tự động
-- slug: duong-ong-du-lieu-tu-dong
-- ID:   8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e
-- ════════════════════════════════════════════════════════════════
INSERT INTO public.course_modules
  (course_id, title, subtitle, duration_minutes, order_index, start_time, item_type)
VALUES
  ('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e',
   'Check-in & Warming up', NULL, 30, 0, '08:00', 'event'),

  ('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e',
   'Module 1: Tổng quan Data Pipeline với AI',
   'ETL vs ELT; Kiến trúc hiện đại: Batch, Stream, Lambda; Khi nào cần AI trong pipeline',
   60, 1, '08:30', 'module'),

  ('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e',
   'Module 2: Thu thập & Làm sạch dữ liệu tự động',
   'Web scraping thông minh với AI; Data cleaning pipeline; Phát hiện & xử lý dữ liệu bẩn',
   60, 2, '09:30', 'module'),

  ('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e',
   'Giải lao & Tea-break', NULL, 20, 3, '10:30', 'break'),

  ('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e',
   'Module 3: Chuyển đổi & Làm giàu dữ liệu bằng LLM',
   'Phân loại, gán nhãn, tóm tắt dữ liệu quy mô lớn; Xử lý văn bản phi cấu trúc thành JSON',
   60, 4, '10:50', 'module'),

  ('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e',
   'Module 4: Orchestration & Scheduling',
   'Apache Airflow cơ bản; n8n workflow tự động; Trigger theo sự kiện, thời gian, điều kiện',
   40, 5, '11:50', 'module'),

  ('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e',
   'Nghỉ trưa & Networking', NULL, 80, 6, '12:30', 'break'),

  ('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e',
   'Module 5: Lưu trữ & Truy vấn thông minh',
   'Chọn đúng database cho từng loại dữ liệu; Vector DB cho AI search; Tối ưu query',
   90, 7, '13:50', 'module'),

  ('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e',
   'Giải lao & Tea-break', NULL, 15, 8, '15:20', 'break'),

  ('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e',
   'Module 6: Thực hành – Xây pipeline báo cáo tự động',
   'End-to-end: Thu thập → Xử lý → Lưu trữ → Gửi báo cáo qua email/Slack mỗi ngày',
   60, 9, '15:35', 'module'),

  ('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e',
   'Demo – Q&A – Trao chứng nhận', NULL, 25, 10, '16:35', 'event'),

  ('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e',
   'Kết thúc', NULL, 0, 11, '17:00', 'event');


-- ════════════════════════════════════════════════════════════════
-- KHÓA 7: Thiết kế UI tạo sinh
-- slug: thiet-ke-ui-tao-sinh
-- ID:   7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d
-- ════════════════════════════════════════════════════════════════
INSERT INTO public.course_modules
  (course_id, title, subtitle, duration_minutes, order_index, start_time, item_type)
VALUES
  ('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d',
   'Check-in & Warming up', NULL, 30, 0, '08:00', 'event'),

  ('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d',
   'Module 1: AI trong quy trình thiết kế hiện đại',
   'Vai trò của AI trong Design System; So sánh công cụ: Midjourney, DALL-E, Stable Diffusion, Figma AI',
   60, 1, '08:30', 'module'),

  ('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d',
   'Module 2: Sinh ảnh & Visual Asset với AI',
   'Viết prompt sinh ảnh chuyên nghiệp; Style reference, Negative prompt; Batch generation',
   60, 2, '09:30', 'module'),

  ('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d',
   'Giải lao & Tea-break', NULL, 20, 3, '10:30', 'break'),

  ('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d',
   'Module 3: Prototyping nhanh với Claude Artifacts',
   'Tạo wireframe, landing page, UI component ngay trong chat; Iterative design với AI',
   60, 4, '10:50', 'module'),

  ('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d',
   'Module 4: Thiết kế hệ thống Design System hỗ trợ AI',
   'Tổ chức token, component library; Figma Variables + AI auto-fill; Tài liệu tự động',
   40, 5, '11:50', 'module'),

  ('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d',
   'Nghỉ trưa & Networking', NULL, 80, 6, '12:30', 'break'),

  ('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d',
   'Module 5: Thực hành – Thiết kế App UI hoàn chỉnh',
   'Nhận brief → Mood board → Wireframe → Hi-fi prototype trong 90 phút với AI',
   90, 7, '13:50', 'module'),

  ('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d',
   'Giải lao & Tea-break', NULL, 15, 8, '15:20', 'break'),

  ('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d',
   'Module 6: Trình bày & Phản biện thiết kế',
   'Pitch design với AI storytelling; Nhận feedback nhanh; Cải tiến real-time',
   45, 9, '15:35', 'module'),

  ('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d',
   'Demo showcase – Q&A – Trao chứng nhận', NULL, 40, 10, '16:20', 'event'),

  ('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d',
   'Kết thúc', NULL, 0, 11, '17:00', 'event');


-- ════════════════════════════════════════════════════════════════
-- KHÓA 8: Tối ưu hóa Prompt Engineering Nâng cao
-- slug: toi-uu-hoa-prompt-engineering-nang-cao
-- ID:   5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b
-- ════════════════════════════════════════════════════════════════
INSERT INTO public.course_modules
  (course_id, title, subtitle, duration_minutes, order_index, start_time, item_type)
VALUES
  ('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b',
   'Check-in & Warming up', NULL, 30, 0, '08:00', 'event'),

  ('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b',
   'Module 1: Giải phẫu prompt đỉnh cao',
   'Tại sao cùng câu hỏi mà kết quả khác nhau; 7 yếu tố cấu thành prompt hiệu quả',
   60, 1, '08:30', 'module'),

  ('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b',
   'Module 2: Advanced Reasoning Techniques',
   'Chain-of-Thought, Tree-of-Thought, ReAct pattern; Khi nào dùng kỹ thuật nào',
   60, 2, '09:30', 'module'),

  ('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b',
   'Giải lao & Tea-break', NULL, 20, 3, '10:30', 'break'),

  ('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b',
   'Module 3: Kiểm soát đầu ra & Giảm thiểu lỗi',
   'Constrained generation, Grounding, Self-consistency; Kỹ thuật tránh hallucination nâng cao',
   60, 4, '10:50', 'module'),

  ('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b',
   'Module 4: Meta-Prompting & Prompt Generator',
   'Dùng AI tạo ra prompt cho AI; Tự động tối ưu hóa prompt qua vòng lặp phản hồi',
   40, 5, '11:50', 'module'),

  ('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b',
   'Nghỉ trưa & Networking', NULL, 80, 6, '12:30', 'break'),

  ('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b',
   'Module 5: Prompt cho từng ngành nghề',
   'Bộ template tối ưu cho: Kế toán – HR – Sales – Marketing – Kỹ thuật – Quản lý',
   90, 7, '13:50', 'module'),

  ('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b',
   'Giải lao & Tea-break', NULL, 15, 8, '15:20', 'break'),

  ('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b',
   'Module 6: Xây dựng Prompt Library cá nhân hóa',
   'Hệ thống quản lý prompt, version control, chia sẻ trong team; Đo lường hiệu quả prompt',
   60, 9, '15:35', 'module'),

  ('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b',
   'Demo – Q&A – Trao chứng nhận', NULL, 25, 10, '16:35', 'event'),

  ('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b',
   'Kết thúc', NULL, 0, 11, '17:00', 'event');


-- ════════════════════════════════════════════════════════════════
-- Cập nhật curriculum_headline cho 3 khóa còn thiếu
-- ════════════════════════════════════════════════════════════════
UPDATE public.courses SET curriculum_headline = '1 ngày – 6 module thực chiến'
  WHERE id = '8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e';

UPDATE public.courses SET curriculum_headline = '1 ngày – 6 module thực chiến'
  WHERE id = '7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d';

UPDATE public.courses SET curriculum_headline = '1 ngày – 6 module thực chiến'
  WHERE id = '5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b';
