-- Migration: 002_add_position_referral_to_registrations.sql
-- Thêm cột chức vụ và nguồn biết đến vào bảng registrations

ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS position TEXT,
  ADD COLUMN IF NOT EXISTS referral TEXT NOT NULL DEFAULT '';
