-- Migration: 004_seed_course_modules.sql
-- Seed đầy đủ nội dung chương trình cho các khóa học
-- Chạy SAU khi đã chạy migration 003 (ALTER TABLE course_modules)
-- Run in Supabase SQL Editor

-- ─── Step 1: Cập nhật bảng course_modules với các cột mới ──────────────────
-- (phòng trường hợp migration 003 chưa chạy)
ALTER TABLE public.course_modules
  ADD COLUMN IF NOT EXISTS subtitle TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS start_time TEXT,
  ADD COLUMN IF NOT EXISTS item_type TEXT NOT NULL DEFAULT 'module'
    CHECK (item_type IN ('module', 'break', 'event'));

-- ─── Step 2: Xóa modules cũ (đơn giản, thiếu data) ────────────────────────
DELETE FROM public.course_modules;

-- ─── Step 3: Seed modules đầy đủ ────────────────────────────────────────────

-- ════════════════════════════════════════════════════════════════
-- KHÓA 1: Làm chủ Claude AI cho Doanh nghiệp
-- slug: lam-chu-claude-ai-cho-doanh-nghiep
-- ID:   9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f
-- Lịch trình: 08:00 – 17:00 | 6 module thực chiến
-- ════════════════════════════════════════════════════════════════
INSERT INTO public.course_modules
  (course_id, title, subtitle, duration_minutes, order_index, start_time, item_type)
VALUES
  -- 08:00
  ('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f',
   'Check-in & Warming up', NULL, 30, 0, '08:00', 'event'),

  -- 08:30
  ('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f',
   'Module 1: Tư duy đúng về AI',
   'Bộ 3: Mindset – Skillset – Toolset; Cấu trúc Prompt chuẩn',
   30, 1, '08:30', 'module'),

  -- 09:00
  ('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f',
   'Module 2: Bộ 4 công cụ cốt lõi của Claude',
   'Skills – não bộ chuyên môn; Projects – bộ nhớ dài hạn',
   60, 2, '09:00', 'module'),

  -- 10:00
  ('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f',
   'Giải lao & Tea-break', NULL, 20, 3, '10:00', 'break'),

  -- 10:20
  ('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f',
   'Module 3: Bộ 4 công cụ cốt lõi của Claude (tiếp)',
   'Connectors – cầu nối ra thế giới bên ngoài; Artifacts – xưởng sản xuất đầu ra',
   60, 4, '10:20', 'module'),

  -- 11:20
  ('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f',
   'Module 4: Tạo Landing Page quảng cáo cùng Claude',
   NULL,
   40, 5, '11:20', 'module'),

  -- 12:00
  ('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f',
   'Nghỉ trưa & Networking', NULL, 80, 6, '12:00', 'break'),

  -- 13:20
  ('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f',
   'Warming up', NULL, 10, 7, '13:20', 'event'),

  -- 13:30
  ('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f',
   'Module 5: Claude + Canva',
   'Kết hợp AI sinh ảnh, thiết kế slide, banner không cần Photoshop',
   90, 8, '13:30', 'module'),

  -- 15:00
  ('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f',
   'Module 6: Claude Cowork (phần 1)',
   'Xây dựng phòng ban AI đa agent – phân vai, phân việc tự động',
   30, 9, '15:00', 'module'),

  -- 15:30
  ('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f',
   'Giải lao & Tea-break', NULL, 15, 10, '15:30', 'break'),

  -- 15:45
  ('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f',
   'Module 6: Claude Cowork (phần 2)',
   'Demo thực tế: tự động hóa pipeline bán hàng, CSKH bằng Multi-agent',
   30, 11, '15:45', 'module'),

  -- 16:15
  ('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f',
   'Demo – Q&A', NULL, 45, 12, '16:15', 'event'),

  -- 17:00
  ('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f',
   'Kết thúc', NULL, 0, 13, '17:00', 'event');


-- ════════════════════════════════════════════════════════════════
-- KHÓA 2: Kỹ thuật Prompt Nâng cao
-- slug: ky-thuat-prompt-nang-cao
-- ID:   e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b
-- ════════════════════════════════════════════════════════════════
INSERT INTO public.course_modules
  (course_id, title, subtitle, duration_minutes, order_index, start_time, item_type)
VALUES
  ('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b',
   'Check-in & Warming up', NULL, 30, 0, '08:00', 'event'),

  ('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b',
   'Module 1: Nền tảng Prompt Engineering',
   'Anatomy of a prompt; Zero-shot, Few-shot, Chain-of-Thought',
   60, 1, '08:30', 'module'),

  ('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b',
   'Module 2: Kỹ thuật điều khiển đầu ra',
   'Structured output, JSON mode, Format control; Tránh hallucination',
   60, 2, '09:30', 'module'),

  ('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b',
   'Giải lao & Tea-break', NULL, 20, 3, '10:30', 'break'),

  ('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b',
   'Module 3: System Prompt & Role Prompting',
   'Persona design, Role-play có kiểm soát, Injecting context hiệu quả',
   60, 4, '10:50', 'module'),

  ('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b',
   'Module 4: Prompt cho doanh nghiệp',
   'Template library, Prompt version control, A/B testing prompt',
   40, 5, '11:50', 'module'),

  ('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b',
   'Nghỉ trưa & Networking', NULL, 80, 6, '12:30', 'break'),

  ('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b',
   'Module 5: Prompt cho Sales & Marketing',
   'Viết content đa kênh, Email sequence, Script bán hàng cá nhân hóa',
   90, 7, '13:50', 'module'),

  ('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b',
   'Module 6: Thực hành & Case study thực tế',
   'Nhóm thực hành 3 case: Marketing, CSKH, Báo cáo tự động',
   60, 8, '15:20', 'module'),

  ('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b',
   'Giải lao & Tea-break', NULL, 15, 9, '16:20', 'break'),

  ('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b',
   'Demo – Q&A – Trao chứng nhận', NULL, 40, 10, '16:35', 'event'),

  ('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b',
   'Kết thúc', NULL, 0, 11, '17:15', 'event');


-- ════════════════════════════════════════════════════════════════
-- KHÓA 3: AI cho Chiến lược Doanh nghiệp
-- slug: ai-cho-chien-luoc-doanh-nghiep
-- ID:   a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d
-- ════════════════════════════════════════════════════════════════
INSERT INTO public.course_modules
  (course_id, title, subtitle, duration_minutes, order_index, start_time, item_type)
VALUES
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
   'Check-in & Warming up', NULL, 30, 0, '08:00', 'event'),

  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
   'Module 1: AI trong bức tranh chiến lược',
   'Vì sao AI không chỉ là công cụ – AI như lợi thế cạnh tranh dài hạn',
   60, 1, '08:30', 'module'),

  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
   'Module 2: Đánh giá & chọn ưu tiên ứng dụng AI',
   'Ma trận Impact-Effort; Chọn 3 use case đầu tiên cho doanh nghiệp bạn',
   60, 2, '09:30', 'module'),

  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
   'Giải lao & Tea-break', NULL, 20, 3, '10:30', 'break'),

  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
   'Module 3: Xây dựng lộ trình chuyển đổi AI',
   '3 giai đoạn: Thí điểm → Nhân rộng → Tối ưu; KPI đo lường thực tế',
   60, 4, '10:50', 'module'),

  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
   'Module 4: Quản trị & rủi ro AI trong doanh nghiệp',
   'Bảo mật dữ liệu, Bias, Governance framework thực tiễn',
   40, 5, '11:50', 'module'),

  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
   'Nghỉ trưa & Workshop Thực hành', NULL, 90, 6, '12:30', 'break'),

  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
   'Module 5: Case study – AI trong Sales & Marketing',
   'Tự động hóa lead scoring, content factory, personalization ở quy mô lớn',
   90, 7, '14:00', 'module'),

  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
   'Module 6: Trình bày kế hoạch AI của bạn',
   'Mỗi nhóm 5 phút pitch – nhận phản hồi từ chuyên gia',
   60, 8, '15:30', 'module'),

  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
   'Giải lao & Tea-break', NULL, 15, 9, '16:30', 'break'),

  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
   'Q&A – Trao chứng nhận – Networking', NULL, 30, 10, '16:45', 'event'),

  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
   'Kết thúc', NULL, 0, 11, '17:15', 'event');


-- ════════════════════════════════════════════════════════════════
-- KHÓA 4: Kiến trúc Tích hợp AI
-- slug: kien-truc-tich-hop-ai
-- ID:   f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c
-- ════════════════════════════════════════════════════════════════
INSERT INTO public.course_modules
  (course_id, title, subtitle, duration_minutes, order_index, start_time, item_type)
VALUES
  ('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c',
   'Check-in & Warming up', NULL, 30, 0, '08:00', 'event'),

  ('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c',
   'Module 1: Tổng quan kiến trúc hệ thống AI',
   'Monolith vs Microservice AI; API Gateway, Rate limiting, Caching cho AI',
   60, 1, '08:30', 'module'),

  ('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c',
   'Module 2: Tích hợp LLM vào hệ thống hiện có',
   'OpenAI / Claude API; Streaming, Retry logic, Error handling chuẩn production',
   60, 2, '09:30', 'module'),

  ('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c',
   'Giải lao & Tea-break', NULL, 20, 3, '10:30', 'break'),

  ('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c',
   'Module 3: RAG – Retrieval Augmented Generation',
   'Embedding, Vector DB (Pinecone/Supabase pgvector), Semantic search thực chiến',
   90, 4, '10:50', 'module'),

  ('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c',
   'Nghỉ trưa & Networking', NULL, 60, 5, '12:20', 'break'),

  ('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c',
   'Module 4: Hệ thống Multi-Agent & Orchestration',
   'LangGraph, AutoGen; Quản lý state, Tool calling, Human-in-the-loop',
   90, 6, '13:20', 'module'),

  ('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c',
   'Giải lao & Tea-break', NULL, 15, 7, '14:50', 'break'),

  ('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c',
   'Module 5: Observability & Monitoring AI',
   'Logging prompt/response, Latency tracking, Cost optimization thực tế',
   60, 8, '15:05', 'module'),

  ('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c',
   'Module 6: Deploy & CI/CD cho hệ thống AI',
   'Docker, GitHub Actions, Blue-green deployment; Rollback an toàn',
   60, 9, '16:05', 'module'),

  ('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c',
   'Q&A – Demo thực tế – Kết thúc', NULL, 45, 10, '17:05', 'event');


-- ════════════════════════════════════════════════════════════════
-- KHÓA 5: Xây dựng AI Agents với kiến trúc Multi-Agent
-- slug: xay-dung-ai-agents-voi-kien-truc-multi-agent
-- ID:   6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c
-- ════════════════════════════════════════════════════════════════
INSERT INTO public.course_modules
  (course_id, title, subtitle, duration_minutes, order_index, start_time, item_type)
VALUES
  ('6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c',
   'Check-in & Warming up', NULL, 30, 0, '08:00', 'event'),

  ('6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c',
   'Module 1: AI Agent là gì?',
   'Phân biệt Agent vs Chatbot vs Automation; Vòng lặp Perceive-Plan-Act',
   60, 1, '08:30', 'module'),

  ('6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c',
   'Module 2: Tool Use & Function Calling',
   'Thiết kế tools cho agent; Xử lý parallel tool calls; Validation output',
   60, 2, '09:30', 'module'),

  ('6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c',
   'Giải lao & Tea-break', NULL, 20, 3, '10:30', 'break'),

  ('6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c',
   'Module 3: Xây dựng Multi-Agent System',
   'Supervisor – Worker pattern; Memory chia sẻ; Tránh vòng lặp vô hạn',
   90, 4, '10:50', 'module'),

  ('6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c',
   'Nghỉ trưa & Networking', NULL, 70, 5, '12:20', 'break'),

  ('6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c',
   'Module 4: Thực hành – Xây Agent CSKH tự động',
   'Từ đầu đến cuối: phân tích yêu cầu → build → test → deploy',
   90, 6, '13:30', 'module'),

  ('6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c',
   'Giải lao & Tea-break', NULL, 15, 7, '15:00', 'break'),

  ('6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c',
   'Module 5: Monitoring & Cải tiến liên tục Agent',
   'Trace logging, Human feedback loop, Fine-tuning agent behavior',
   60, 8, '15:15', 'module'),

  ('6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c',
   'Demo showcase – Q&A – Kết thúc', NULL, 45, 9, '16:15', 'event');

-- ════════════════════════════════════════════════════════════════
-- Cập nhật curriculum_headline cho các khóa
-- ════════════════════════════════════════════════════════════════
UPDATE public.courses SET curriculum_headline = '1 ngày – 6 module thực chiến'
  WHERE id = '9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f';

UPDATE public.courses SET curriculum_headline = '1 ngày – 6 module thực chiến'
  WHERE id = 'e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b';

UPDATE public.courses SET curriculum_headline = '1 ngày – 6 module thực chiến'
  WHERE id = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';

UPDATE public.courses SET curriculum_headline = '1 ngày – 6 module thực chiến'
  WHERE id = 'f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c';

UPDATE public.courses SET curriculum_headline = '1 ngày – 5 module thực chiến'
  WHERE id = '6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c';
