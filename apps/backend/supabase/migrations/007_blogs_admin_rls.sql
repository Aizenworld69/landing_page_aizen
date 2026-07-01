-- Migration: 007_blogs_admin_rls.sql
-- Them policy admin quan ly blogs (service_role bypass RLS mac dinh)
-- Neu goi Supabase qua service_role key thi khong can them policy.
-- File nay de document ro rang; service_role da co full access.

-- Neu muon dung anon key cho admin (khong khuyen nghi), uncomment:
-- CREATE POLICY "Admin full access blogs"
--   ON public.blogs FOR ALL
--   USING (auth.jwt() ->> 'role' = 'admin')
--   WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- NOTE: Backend NestJS dung SUPABASE_SERVICE_ROLE_KEY => bypass RLS.
-- Khong can them policy.
SELECT 1;