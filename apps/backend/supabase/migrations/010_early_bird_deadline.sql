-- ─────────────────────────────────────────────────────────────
-- 010_early_bird_deadline.sql
-- Cho phép admin cấu hình hạn chót đăng ký gói Early Bird.
-- Khi qua mốc thời gian này, frontend tự động khóa gói Early Bird
-- (hiển thị "Đã hết hạn đăng ký"). Nếu để NULL -> không giới hạn,
-- gói Early Bird luôn mở như các gói khác (an toàn ngược cho khóa
-- học cũ chưa cấu hình).
-- ─────────────────────────────────────────────────────────────

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS early_bird_deadline TIMESTAMPTZ;
