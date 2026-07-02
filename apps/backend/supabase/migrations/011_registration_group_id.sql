-- ─────────────────────────────────────────────────────────────
-- 011_registration_group_id.sql
-- Thêm cột group_id để liên kết các dòng đăng ký thuộc CÙNG MỘT
-- lượt đăng ký nhóm (Nhóm 2 người / Nhóm 4 người). Mỗi thành viên
-- trong nhóm vẫn là 1 dòng riêng trong bảng registrations (để giữ
-- unique theo email), nhưng nay có chung group_id để admin panel
-- gom nhóm hiển thị được ai đăng ký chung với ai.
-- Đăng ký cá nhân / early_bird -> group_id = NULL.
-- ─────────────────────────────────────────────────────────────

ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS group_id UUID;

CREATE INDEX IF NOT EXISTS idx_registrations_group_id
  ON registrations (group_id)
  WHERE group_id IS NOT NULL;
