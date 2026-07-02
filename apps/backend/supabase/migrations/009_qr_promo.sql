-- ─────────────────────────────────────────────────────────────
-- 009_qr_promo.sql
-- Thêm cột QR ảnh dành cho phiên bản khuyến mãi (có giảm giá)
-- Khi promo hết hạn → hệ thống tự fall back về QR gốc
-- ─────────────────────────────────────────────────────────────

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS qr_early_bird_promo TEXT,
  ADD COLUMN IF NOT EXISTS qr_individual_promo TEXT,
  ADD COLUMN IF NOT EXISTS qr_group_2_promo    TEXT,
  ADD COLUMN IF NOT EXISTS qr_group_4_promo    TEXT;
