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

-- 3. Course Modules (For Claude AI Course)
INSERT INTO public.course_modules (course_id, title, duration_minutes, order_index)
VALUES 
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 'Đón khách & Khởi động', 30, 0),
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 'Module 1: Tư duy đúng về AI (Bộ 3: Mindset - Skillset - Toolset; Cấu trúc Prompt chuẩn)', 30, 1),
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 'Module 2: Bộ 4 công cụ cốt lõi của Claude (Skills - não bộ chuyên môn; Projects - bộ nhớ dài hạn)', 60, 2);

-- 4. Reviews
INSERT INTO public.reviews (course_id, rating, content, student_name, student_avatar_url)
VALUES 
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 5, 'Khóa học cung cấp kiến thức vô cùng thực tế. Từ một người không biết gì về AI, giờ tôi đã có thể tự động hóa 40% công việc hàng ngày của mình. Cảm ơn đội ngũ giảng viên rất nhiều!', 'Nguyễn Mai Trang', NULL),
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 5, 'Phương pháp giảng dạy rất hệ thống. Việc áp dụng ngay vào các case study thực tế của doanh nghiệp giúp tôi hiểu sâu và có thể triển khai ngay lập tức vào công việc.', 'Trần Hoàng Long', NULL),
('9a8b7c6d-5e4f-3a2b-1c0d-9e8d7c6b5a4f', 5, 'Công cụ Midjourney và ChatGPT được hướng dẫn rất chi tiết từ cơ bản đến nâng cao. Chất lượng hình ảnh thiết kế của team tôi đã cải thiện rõ rệt sau khi tham gia khóa học.', 'Phạm Quang Huy', NULL);
