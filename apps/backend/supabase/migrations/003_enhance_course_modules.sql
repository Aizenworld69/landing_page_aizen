-- Migration: 003_enhance_course_modules.sql
-- Thêm các trường để quản lý nội dung chương trình từ admin

ALTER TABLE public.course_modules
  -- Mô tả phụ hiển thị dưới tiêu đề (VD: "Bộ 3: Mindset - Skillset - Toolset")
  ADD COLUMN IF NOT EXISTS subtitle TEXT,

  -- Mô tả chi tiết module (optional, cho admin nhập)
  ADD COLUMN IF NOT EXISTS description TEXT,

  -- Giờ bắt đầu theo định dạng HH:MM (VD: '08:00', '09:30')
  -- Nếu NULL thì frontend sẽ tự tính dựa trên order_index + duration
  ADD COLUMN IF NOT EXISTS start_time TEXT,

  -- Loại item trong timeline
  -- 'module' = bài học / 'break' = nghỉ / 'event' = sự kiện (check-in, kết thúc)
  ADD COLUMN IF NOT EXISTS item_type TEXT NOT NULL DEFAULT 'module'
    CHECK (item_type IN ('module', 'break', 'event'));

-- Index hỗ trợ sắp xếp
-- (order_index đã có idx_course_modules_course, không cần thêm)

COMMENT ON COLUMN public.course_modules.subtitle IS 'Mô tả phụ hiển thị dưới title trong timeline';
COMMENT ON COLUMN public.course_modules.description IS 'Mô tả chi tiết nội dung module';
COMMENT ON COLUMN public.course_modules.start_time IS 'Giờ bắt đầu HH:MM, nếu NULL thì auto-calculate từ order';
COMMENT ON COLUMN public.course_modules.item_type IS 'module | break | event';
