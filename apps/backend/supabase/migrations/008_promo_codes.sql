-- ─────────────────────────────────────────────────────────────
-- 008_promo_codes.sql
-- Hệ thống mã khuyến mãi cho từng khóa học
-- ─────────────────────────────────────────────────────────────

-- Bảng mã khuyến mãi
CREATE TABLE IF NOT EXISTS promo_codes (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  code           TEXT        NOT NULL UNIQUE,         -- Admin tự đặt VD: "AIZEN50"
  course_id      UUID        NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  plan           TEXT        NOT NULL DEFAULT 'all',  -- 'individual' | 'group' | 'all'
  discount_type  TEXT        NOT NULL DEFAULT 'percent', -- 'percent' | 'fixed'
  discount_value NUMERIC     NOT NULL CHECK (discount_value > 0),
  max_uses       INT         NOT NULL DEFAULT 1 CHECK (max_uses > 0),
  used_count     INT         NOT NULL DEFAULT 0 CHECK (used_count >= 0),
  expires_at     TIMESTAMPTZ,                         -- NULL = không hết hạn
  is_active      BOOLEAN     NOT NULL DEFAULT true,
  note           TEXT,                                -- Ghi chú nội bộ
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index tìm kiếm nhanh theo code (validate request)
CREATE INDEX IF NOT EXISTS idx_promo_codes_code       ON promo_codes (UPPER(code));
CREATE INDEX IF NOT EXISTS idx_promo_codes_course_id  ON promo_codes (course_id);

-- Thêm cột vào bảng registrations để trace mã đã dùng
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS promo_code      TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS discount_amount NUMERIC NOT NULL DEFAULT 0;

-- RLS: admin service role có thể CRUD, public chỉ SELECT (không cần xem)
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on promo_codes"
  ON promo_codes FOR ALL
  USING (true)
  WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────
-- RPC: tăng used_count một cách atomic (SET used_count = used_count + 1)
-- Chỉ tăng nếu used_count < max_uses để tránh vượt giới hạn
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION increment_promo_used_count(p_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE promo_codes
  SET used_count = used_count + 1
  WHERE id = p_id
    AND used_count < max_uses
    AND is_active = true;
END;
$$;
