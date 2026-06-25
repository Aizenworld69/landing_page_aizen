-- Migration: 001_initial_schema.sql
-- Run in Supabase SQL Editor to setup schema and seed data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. profiles (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY,
  full_name   TEXT NOT NULL DEFAULT '',
  phone       TEXT,
  email       TEXT,
  company     TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. instructors
-- ============================================================
CREATE TABLE IF NOT EXISTS public.instructors (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  title         TEXT NOT NULL,
  bio           TEXT NOT NULL DEFAULT '',
  avatar_url    TEXT,
  social_links  JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. courses
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_status') THEN
        CREATE TYPE course_status AS ENUM ('upcoming', 'completed');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS public.courses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT NOT NULL DEFAULT '',
  thumbnail_url   TEXT,
  status          course_status NOT NULL DEFAULT 'upcoming',
  category        TEXT NOT NULL,
  start_date      DATE,
  price           NUMERIC(12, 0) NOT NULL DEFAULT 0,
  price_group     NUMERIC(12, 0) NOT NULL DEFAULT 0,
  instructor_id   UUID REFERENCES public.instructors(id) ON DELETE SET NULL,
  skills          JSONB NOT NULL DEFAULT '[]',
  curriculum_headline TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add columns to existing table if they don't exist
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS skills JSONB NOT NULL DEFAULT '[]';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS curriculum_headline TEXT;

-- ============================================================
-- 4. course_modules
-- ============================================================
CREATE TABLE IF NOT EXISTS public.course_modules (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id         UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  duration_minutes  INT NOT NULL DEFAULT 0,
  order_index       INT NOT NULL DEFAULT 0
);

-- ============================================================
-- 5. registrations
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_type') THEN
        CREATE TYPE plan_type AS ENUM ('individual', 'group');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS public.registrations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id   UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  phone       TEXT NOT NULL,
  email       TEXT NOT NULL,
  company     TEXT,
  plan        plan_type NOT NULL DEFAULT 'individual',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (course_id, email)
);

-- ============================================================
-- 6. enrollments
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enrollment_status') THEN
        CREATE TYPE enrollment_status AS ENUM ('upcoming', 'completed');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS public.enrollments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL,
  course_id     UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status        enrollment_status NOT NULL DEFAULT 'upcoming',
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_id)
);

-- ============================================================
-- 7. reviews
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID,
  course_id   UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content     TEXT NOT NULL,
  student_name TEXT,
  student_avatar_url TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Clean existing data
TRUNCATE public.course_modules, public.courses, public.instructors, public.reviews CASCADE;

-- -- 1. Instructors
INSERT INTO public.instructors (id, name, title, bio, avatar_url, social_links)
VALUES 
('b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Lê Thanh Hải', 'CEO AIZEN', 'Chuyên gia với hơn 15 năm kinh nghiệm thực chiến trong ngành Công nghệ thông tin. Anh trực tiếp dẫn dắt lộ trình đưa AI vào vận hành, giúp doanh nghiệp đóng gói quy trình, tối ưu hiệu suất và bứt phá doanh thu từ những trải nghiệm và ứng dụng thực tế nhất.', '/dien-gia.jpg', '{"linkedin": "https://linkedin.com/in/hai-le", "email": "hai.le@aizen.edu.vn"}');

-- 2. Courses
INSERT INTO public.courses (id, title, slug, description, thumbnail_url, status, category, start_date, price, price_group, instructor_id, skills, curriculum_headline)
VALUES 
-- Upcoming Courses
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'AI cho Chiến lược Doanh nghiệp', 'ai-cho-chien-luoc-doanh-nghiep', 'Hướng dẫn toàn diện về triển khai các giải pháp AI ở quy mô lớn trong môi trường doanh nghiệp.', NULL, 'upcoming', 'Business AI', CURRENT_DATE + INTERVAL '12 days', 1300000, 1100000, 'b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '[]', NULL),
('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b', 'Kỹ thuật Prompt Nâng cao', 'ky-thuat-prompt-nang-cao', 'Làm chủ các tương tác LLM phức tạp để tự động hóa quy trình làm việc và phân tích dữ liệu.', NULL, 'upcoming', 'AI & Machine Learning', CURRENT_DATE + INTERVAL '19 days', 1500000, 1200000, 'b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '[]', NULL),
('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c', 'Kiến trúc Tích hợp AI', 'kien-truc-tich-hop-ai', 'Thiết kế các hệ thống mạnh mẽ kết hợp liền mạch các mô hình AI tạo sinh.', NULL, 'upcoming', 'Automation', CURRENT_DATE + INTERVAL '33 days', 1800000, 1500000, 'b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '[]', NULL),

-- Completed Courses (Claude AI featured, others list library)
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 'Làm chủ Claude AI cho Doanh nghiệp', 'lam-chu-claude-ai-cho-doanh-nghiep', 'Nghiên cứu sâu về Claude của Anthropic, tập trung vào cửa sổ ngữ cảnh, các trường hợp sử dụng thực tế và chiến lược triển khai.', '/images/courses/claude_ai.png', 'completed', 'Business AI', '2024-09-10', 1300000, 1100000, 'b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 
'[
  {"title": "Claude Cowork", "description": "Cowork là cả một phòng ban AI trong lòng bàn tay – mỗi agent đảm nhận một vai trò, tự vận hành, tự phối hợp với nhau, và giao cho bạn kết quả cuối cùng như một đội ngũ thực thụ.", "badge": "ĐẶC BIỆT"},
  {"title": "Claude Skills", "description": "Biến mỗi nhân sự hoặc quy trình công ty thành Skill cố định – gọi một lúc nhiều Skills, Claude tự xử lý đa nhiệm mà không cần ra lệnh lại."},
  {"title": "Claude Projects", "description": "Giao việc cho đúng người, giúp bạn tạo ra những ''chuyên gia ảo'' theo từng lĩnh vực, luôn hiểu đúng context và làm việc theo chuẩn của bạn."},
  {"title": "Claude Connectors", "description": "Chìa khóa để Claude kết nối với hệ thống công việc như Gmail, Google Drive, Calendar... để xây dựng các trợ lý tự động."},
  {"title": "Claude Artifacts", "description": "Xây luôn cho bạn một app, website, landing page hay công cụ tương tác ngay trong khung chat, không cần code."}
]', '1 ngày – 6 module thực chiến'),

('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e', 'Đường ống dữ liệu tự động', 'duong-ong-du-lieu-tu-dong', 'Xây dựng quy trình làm việc ETL hiệu quả với các công cụ AI hiện đại.', '/images/courses/data_pipeline.png', 'completed', 'Data Science', '2024-08-15', 1500000, 1200000, 'b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '[]', NULL),
('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d', 'Thiết kế UI tạo sinh', 'thiet-ke-ui-tao-sinh', 'Sử dụng AI để tăng tốc độ tạo nguyên mẫu và hệ thống thiết kế.', '/images/courses/generative_ui.png', 'completed', 'Design', '2024-06-20', 1200000, 1000000, 'b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '[]', NULL),
('6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c', 'Xây dựng AI Agents với kiến trúc Multi-Agent', 'xay-dung-ai-agents-voi-kien-truc-multi-agent', 'Thiết kế và triển khai hệ thống đa tác tử (Multi-Agent), cho phép các AI làm việc cộng tác giải quyết vấn đề lớn mà một agent không làm được.', '/images/courses/multi_agent.png', 'completed', 'AI & Machine Learning', '2024-08-05', 1800000, 1500000, 'b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '[]', NULL),
('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b', 'Tối ưu hóa Prompt Engineering Nâng cao', 'toi-uu-hoa-prompt-engineering-nang-cao', 'Kỹ thuật tinh chỉnh câu lệnh để kiểm soát độ chính xác, phong cách và định dạng đầu ra của các LLM hàng đầu hiện nay.', '/images/courses/prompt_engineering.png', 'completed', 'Automation', '2024-06-06', 1400000, 1100000, 'b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '[]', NULL);

-- 3. Course Modules (đầy đủ cho tất cả khóa học)
-- Cần chạy migration 003 trước để có subtitle, description, start_time, item_type
-- Nếu dùng seed.sql thuần, hãy chạy migration 004 và 005 riêng

INSERT INTO public.course_modules (course_id, title, subtitle, duration_minutes, order_index, start_time, item_type)
VALUES
-- ── Khóa 1: Làm chủ Claude AI (9a8b7c6d) ──
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 'Check-in & Warming up', NULL, 30, 0, '08:00', 'event'),
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 'Module 1: Tư duy đúng về AI', 'Bộ 3: Mindset – Skillset – Toolset; Cấu trúc Prompt chuẩn', 30, 1, '08:30', 'module'),
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 'Module 2: Bộ 4 công cụ cốt lõi của Claude', 'Skills – não bộ chuyên môn; Projects – bộ nhớ dài hạn', 60, 2, '09:00', 'module'),
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 'Giải lao & Tea-break', NULL, 20, 3, '10:00', 'break'),
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 'Module 3: Bộ 4 công cụ cốt lõi của Claude (tiếp)', 'Connectors – cầu nối ra thế giới bên ngoài; Artifacts – xưởng sản xuất đầu ra', 60, 4, '10:20', 'module'),
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 'Module 4: Tạo Landing Page quảng cáo cùng Claude', NULL, 40, 5, '11:20', 'module'),
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 'Nghỉ trưa & Networking', NULL, 80, 6, '12:00', 'break'),
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 'Warming up', NULL, 10, 7, '13:20', 'event'),
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 'Module 5: Claude + Canva', 'Kết hợp AI sinh ảnh, thiết kế slide, banner không cần Photoshop', 90, 8, '13:30', 'module'),
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 'Module 6: Claude Cowork (phần 1)', 'Xây dựng phòng ban AI đa agent – phân vai, phân việc tự động', 30, 9, '15:00', 'module'),
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 'Giải lao & Tea-break', NULL, 15, 10, '15:30', 'break'),
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 'Module 6: Claude Cowork (phần 2)', 'Demo thực tế: tự động hóa pipeline bán hàng, CSKH bằng Multi-agent', 30, 11, '15:45', 'module'),
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 'Demo – Q&A', NULL, 45, 12, '16:15', 'event'),
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 'Kết thúc', NULL, 0, 13, '17:00', 'event'),

-- ── Khóa 2: Kỹ thuật Prompt Nâng cao (e2f3a4b5) ──
('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b', 'Check-in & Warming up', NULL, 30, 0, '08:00', 'event'),
('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b', 'Module 1: Nền tảng Prompt Engineering', 'Anatomy of a prompt; Zero-shot, Few-shot, Chain-of-Thought', 60, 1, '08:30', 'module'),
('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b', 'Module 2: Kỹ thuật điều khiển đầu ra', 'Structured output, JSON mode, Format control; Tránh hallucination', 60, 2, '09:30', 'module'),
('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b', 'Giải lao & Tea-break', NULL, 20, 3, '10:30', 'break'),
('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b', 'Module 3: System Prompt & Role Prompting', 'Persona design, Role-play có kiểm soát, Injecting context hiệu quả', 60, 4, '10:50', 'module'),
('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b', 'Module 4: Prompt cho doanh nghiệp', 'Template library, Prompt version control, A/B testing prompt', 40, 5, '11:50', 'module'),
('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b', 'Nghỉ trưa & Networking', NULL, 80, 6, '12:30', 'break'),
('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b', 'Module 5: Prompt cho Sales & Marketing', 'Viết content đa kênh, Email sequence, Script bán hàng cá nhân hóa', 90, 7, '13:50', 'module'),
('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b', 'Module 6: Thực hành & Case study thực tế', 'Nhóm thực hành 3 case: Marketing, CSKH, Báo cáo tự động', 60, 8, '15:20', 'module'),
('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b', 'Giải lao & Tea-break', NULL, 15, 9, '16:20', 'break'),
('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b', 'Demo – Q&A – Trao chứng nhận', NULL, 40, 10, '16:35', 'event'),
('e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b', 'Kết thúc', NULL, 0, 11, '17:15', 'event'),

-- ── Khóa 3: AI cho Chiến lược Doanh nghiệp (a1b2c3d4) ──
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Check-in & Warming up', NULL, 30, 0, '08:00', 'event'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Module 1: AI trong bức tranh chiến lược', 'Vì sao AI không chỉ là công cụ – AI như lợi thế cạnh tranh dài hạn', 60, 1, '08:30', 'module'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Module 2: Đánh giá & chọn ưu tiên ứng dụng AI', 'Ma trận Impact-Effort; Chọn 3 use case đầu tiên cho doanh nghiệp bạn', 60, 2, '09:30', 'module'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Giải lao & Tea-break', NULL, 20, 3, '10:30', 'break'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Module 3: Xây dựng lộ trình chuyển đổi AI', '3 giai đoạn: Thí điểm → Nhân rộng → Tối ưu; KPI đo lường thực tế', 60, 4, '10:50', 'module'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Module 4: Quản trị & rủi ro AI trong doanh nghiệp', 'Bảo mật dữ liệu, Bias, Governance framework thực tiễn', 40, 5, '11:50', 'module'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Nghỉ trưa & Workshop Thực hành', NULL, 90, 6, '12:30', 'break'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Module 5: Case study – AI trong Sales & Marketing', 'Tự động hóa lead scoring, content factory, personalization ở quy mô lớn', 90, 7, '14:00', 'module'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Module 6: Trình bày kế hoạch AI của bạn', 'Mỗi nhóm 5 phút pitch – nhận phản hồi từ chuyên gia', 60, 8, '15:30', 'module'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Giải lao & Tea-break', NULL, 15, 9, '16:30', 'break'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Q&A – Trao chứng nhận – Networking', NULL, 30, 10, '16:45', 'event'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Kết thúc', NULL, 0, 11, '17:15', 'event'),

-- ── Khóa 4: Kiến trúc Tích hợp AI (f3a4b5c6) ──
('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c', 'Check-in & Warming up', NULL, 30, 0, '08:00', 'event'),
('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c', 'Module 1: Tổng quan kiến trúc hệ thống AI', 'Monolith vs Microservice AI; API Gateway, Rate limiting, Caching cho AI', 60, 1, '08:30', 'module'),
('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c', 'Module 2: Tích hợp LLM vào hệ thống hiện có', 'OpenAI / Claude API; Streaming, Retry logic, Error handling chuẩn production', 60, 2, '09:30', 'module'),
('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c', 'Giải lao & Tea-break', NULL, 20, 3, '10:30', 'break'),
('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c', 'Module 3: RAG – Retrieval Augmented Generation', 'Embedding, Vector DB (Pinecone/Supabase pgvector), Semantic search thực chiến', 90, 4, '10:50', 'module'),
('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c', 'Nghỉ trưa & Networking', NULL, 60, 5, '12:20', 'break'),
('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c', 'Module 4: Hệ thống Multi-Agent & Orchestration', 'LangGraph, AutoGen; Quản lý state, Tool calling, Human-in-the-loop', 90, 6, '13:20', 'module'),
('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c', 'Giải lao & Tea-break', NULL, 15, 7, '14:50', 'break'),
('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c', 'Module 5: Observability & Monitoring AI', 'Logging prompt/response, Latency tracking, Cost optimization thực tế', 60, 8, '15:05', 'module'),
('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c', 'Module 6: Deploy & CI/CD cho hệ thống AI', 'Docker, GitHub Actions, Blue-green deployment; Rollback an toàn', 60, 9, '16:05', 'module'),
('f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c', 'Q&A – Demo thực tế – Kết thúc', NULL, 45, 10, '17:05', 'event'),

-- ── Khóa 5: Xây dựng AI Agents Multi-Agent (6d5e4f3a) ──
('6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c', 'Check-in & Warming up', NULL, 30, 0, '08:00', 'event'),
('6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c', 'Module 1: AI Agent là gì?', 'Phân biệt Agent vs Chatbot vs Automation; Vòng lặp Perceive-Plan-Act', 60, 1, '08:30', 'module'),
('6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c', 'Module 2: Tool Use & Function Calling', 'Thiết kế tools cho agent; Xử lý parallel tool calls; Validation output', 60, 2, '09:30', 'module'),
('6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c', 'Giải lao & Tea-break', NULL, 20, 3, '10:30', 'break'),
('6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c', 'Module 3: Xây dựng Multi-Agent System', 'Supervisor – Worker pattern; Memory chia sẻ; Tránh vòng lặp vô hạn', 90, 4, '10:50', 'module'),
('6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c', 'Nghỉ trưa & Networking', NULL, 70, 5, '12:20', 'break'),
('6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c', 'Module 4: Thực hành – Xây Agent CSKH tự động', 'Từ đầu đến cuối: phân tích yêu cầu → build → test → deploy', 90, 6, '13:30', 'module'),
('6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c', 'Giải lao & Tea-break', NULL, 15, 7, '15:00', 'break'),
('6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c', 'Module 5: Monitoring & Cải tiến liên tục Agent', 'Trace logging, Human feedback loop, Fine-tuning agent behavior', 60, 8, '15:15', 'module'),
('6d5e4f3a-2b1c-0d9e-8d7c-6b5a4f3e2d1c', 'Demo showcase – Q&A – Kết thúc', NULL, 45, 9, '16:15', 'event'),

-- ── Khóa 6: Đường ống dữ liệu tự động (8b7c6d5e) ──
('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e', 'Check-in & Warming up', NULL, 30, 0, '08:00', 'event'),
('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e', 'Module 1: Tổng quan Data Pipeline với AI', 'ETL vs ELT; Kiến trúc hiện đại: Batch, Stream, Lambda; Khi nào cần AI trong pipeline', 60, 1, '08:30', 'module'),
('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e', 'Module 2: Thu thập & Làm sạch dữ liệu tự động', 'Web scraping thông minh với AI; Data cleaning pipeline; Phát hiện & xử lý dữ liệu bẩn', 60, 2, '09:30', 'module'),
('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e', 'Giải lao & Tea-break', NULL, 20, 3, '10:30', 'break'),
('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e', 'Module 3: Chuyển đổi & Làm giàu dữ liệu bằng LLM', 'Phân loại, gán nhãn, tóm tắt dữ liệu quy mô lớn; Xử lý văn bản phi cấu trúc thành JSON', 60, 4, '10:50', 'module'),
('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e', 'Module 4: Orchestration & Scheduling', 'Apache Airflow cơ bản; n8n workflow tự động; Trigger theo sự kiện, thời gian, điều kiện', 40, 5, '11:50', 'module'),
('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e', 'Nghỉ trưa & Networking', NULL, 80, 6, '12:30', 'break'),
('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e', 'Module 5: Lưu trữ & Truy vấn thông minh', 'Chọn đúng database cho từng loại dữ liệu; Vector DB cho AI search; Tối ưu query', 90, 7, '13:50', 'module'),
('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e', 'Giải lao & Tea-break', NULL, 15, 8, '15:20', 'break'),
('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e', 'Module 6: Thực hành – Xây pipeline báo cáo tự động', 'End-to-end: Thu thập → Xử lý → Lưu trữ → Gửi báo cáo qua email/Slack mỗi ngày', 60, 9, '15:35', 'module'),
('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e', 'Demo – Q&A – Trao chứng nhận', NULL, 25, 10, '16:35', 'event'),
('8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e', 'Kết thúc', NULL, 0, 11, '17:00', 'event'),

-- ── Khóa 7: Thiết kế UI tạo sinh (7c6d5e4f) ──
('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d', 'Check-in & Warming up', NULL, 30, 0, '08:00', 'event'),
('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d', 'Module 1: AI trong quy trình thiết kế hiện đại', 'Vai trò của AI trong Design System; So sánh công cụ: Midjourney, DALL-E, Stable Diffusion, Figma AI', 60, 1, '08:30', 'module'),
('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d', 'Module 2: Sinh ảnh & Visual Asset với AI', 'Viết prompt sinh ảnh chuyên nghiệp; Style reference, Negative prompt; Batch generation', 60, 2, '09:30', 'module'),
('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d', 'Giải lao & Tea-break', NULL, 20, 3, '10:30', 'break'),
('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d', 'Module 3: Prototyping nhanh với Claude Artifacts', 'Tạo wireframe, landing page, UI component ngay trong chat; Iterative design với AI', 60, 4, '10:50', 'module'),
('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d', 'Module 4: Thiết kế hệ thống Design System hỗ trợ AI', 'Tổ chức token, component library; Figma Variables + AI auto-fill; Tài liệu tự động', 40, 5, '11:50', 'module'),
('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d', 'Nghỉ trưa & Networking', NULL, 80, 6, '12:30', 'break'),
('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d', 'Module 5: Thực hành – Thiết kế App UI hoàn chỉnh', 'Nhận brief → Mood board → Wireframe → Hi-fi prototype trong 90 phút với AI', 90, 7, '13:50', 'module'),
('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d', 'Giải lao & Tea-break', NULL, 15, 8, '15:20', 'break'),
('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d', 'Module 6: Trình bày & Phản biện thiết kế', 'Pitch design với AI storytelling; Nhận feedback nhanh; Cải tiến real-time', 45, 9, '15:35', 'module'),
('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d', 'Demo showcase – Q&A – Trao chứng nhận', NULL, 40, 10, '16:20', 'event'),
('7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d', 'Kết thúc', NULL, 0, 11, '17:00', 'event'),

-- ── Khóa 8: Tối ưu hóa Prompt Engineering Nâng cao (5e4f3a2b) ──
('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b', 'Check-in & Warming up', NULL, 30, 0, '08:00', 'event'),
('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b', 'Module 1: Giải phẫu prompt đỉnh cao', 'Tại sao cùng câu hỏi mà kết quả khác nhau; 7 yếu tố cấu thành prompt hiệu quả', 60, 1, '08:30', 'module'),
('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b', 'Module 2: Advanced Reasoning Techniques', 'Chain-of-Thought, Tree-of-Thought, ReAct pattern; Khi nào dùng kỹ thuật nào', 60, 2, '09:30', 'module'),
('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b', 'Giải lao & Tea-break', NULL, 20, 3, '10:30', 'break'),
('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b', 'Module 3: Kiểm soát đầu ra & Giảm thiểu lỗi', 'Constrained generation, Grounding, Self-consistency; Kỹ thuật tránh hallucination nâng cao', 60, 4, '10:50', 'module'),
('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b', 'Module 4: Meta-Prompting & Prompt Generator', 'Dùng AI tạo ra prompt cho AI; Tự động tối ưu hóa prompt qua vòng lặp phản hồi', 40, 5, '11:50', 'module'),
('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b', 'Nghỉ trưa & Networking', NULL, 80, 6, '12:30', 'break'),
('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b', 'Module 5: Prompt cho từng ngành nghề', 'Bộ template tối ưu cho: Kế toán – HR – Sales – Marketing – Kỹ thuật – Quản lý', 90, 7, '13:50', 'module'),
('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b', 'Giải lao & Tea-break', NULL, 15, 8, '15:20', 'break'),
('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b', 'Module 6: Xây dựng Prompt Library cá nhân hóa', 'Hệ thống quản lý prompt, version control, chia sẻ trong team; Đo lường hiệu quả prompt', 60, 9, '15:35', 'module'),
('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b', 'Demo – Q&A – Trao chứng nhận', NULL, 25, 10, '16:35', 'event'),
('5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b', 'Kết thúc', NULL, 0, 11, '17:00', 'event');

-- 4. Reviews
INSERT INTO public.reviews (course_id, rating, content, student_name, student_avatar_url)
VALUES 
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 5, 'Khóa học cung cấp kiến thức vô cùng thực tế. Từ một người không biết gì về AI, giờ tôi đã có thể tự động hóa 40% công việc hàng ngày của mình. Cảm ơn đội ngũ giảng viên rất nhiều!', 'Nguyễn Mai Trang', NULL),
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 5, 'Phương pháp giảng dạy rất hệ thống. Việc áp dụng ngay vào các case study thực tế của doanh nghiệp giúp tôi hiểu sâu và có thể triển khai ngay lập tức vào công việc.', 'Trần Hoàng Long', NULL),
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 5, 'Công cụ Midjourney và ChatGPT được hướng dẫn rất chi tiết từ cơ bản đến nâng cao. Chất lượng hình ảnh thiết kế của team tôi đã cải thiện rõ rệt sau khi tham gia khóa học.', 'Phạm Quang Huy', NULL);

-- ════════════════════════════════════════════════════════════════
-- 5. Cập nhật curriculum_headline cho tất cả 8 khóa
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

UPDATE public.courses SET curriculum_headline = '1 ngày – 6 module thực chiến'
  WHERE id = '8b7c6d5e-4f3a-2b1c-0d9e-8d7c6b5a4f3e';

UPDATE public.courses SET curriculum_headline = '1 ngày – 6 module thực chiến'
  WHERE id = '7c6d5e4f-3a2b-1c0d-9e8d-7c6b5a4f3e2d';

UPDATE public.courses SET curriculum_headline = '1 ngày – 6 module thực chiến'
  WHERE id = '5e4f3a2b-1c0d-9e8d-7c6b-5a4f3e2d1c0b';

