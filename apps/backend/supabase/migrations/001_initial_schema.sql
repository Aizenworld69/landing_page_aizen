-- Migration: 001_initial_schema.sql
-- Run in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. profiles (extends auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL DEFAULT '',
  phone       TEXT,
  email       TEXT,
  company     TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. instructors
-- ============================================================
CREATE TABLE public.instructors (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  title         TEXT NOT NULL,
  bio           TEXT NOT NULL DEFAULT '',
  avatar_url    TEXT,
  social_links  JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Instructors are publicly viewable"
  ON public.instructors FOR SELECT
  USING (true);

-- ============================================================
-- 3. courses
-- ============================================================
CREATE TYPE course_status AS ENUM ('upcoming', 'completed');

CREATE TABLE public.courses (
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
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_courses_status ON public.courses(status);
CREATE INDEX idx_courses_slug ON public.courses(slug);
CREATE INDEX idx_courses_instructor ON public.courses(instructor_id);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Courses are publicly viewable"
  ON public.courses FOR SELECT
  USING (true);

-- ============================================================
-- 4. course_modules
-- ============================================================
CREATE TABLE public.course_modules (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id         UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  duration_minutes  INT NOT NULL DEFAULT 0,
  order_index       INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_course_modules_course ON public.course_modules(course_id);

ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Course modules are publicly viewable"
  ON public.course_modules FOR SELECT
  USING (true);

-- ============================================================
-- 5. registrations (landing page, khong can login)
-- ============================================================
CREATE TYPE plan_type AS ENUM ('individual', 'group');

CREATE TABLE public.registrations (
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

CREATE INDEX idx_registrations_course ON public.registrations(course_id);
CREATE INDEX idx_registrations_email ON public.registrations(email);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Insert-only for anonymous users, reads only via service role
CREATE POLICY "Anyone can register"
  ON public.registrations FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- 6. enrollments (can login)
-- ============================================================
CREATE TYPE enrollment_status AS ENUM ('upcoming', 'completed');

CREATE TABLE public.enrollments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id     UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status        enrollment_status NOT NULL DEFAULT 'upcoming',
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_id)
);

CREATE INDEX idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enrollments"
  ON public.enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own enrollments"
  ON public.enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 7. reviews
-- ============================================================
CREATE TABLE public.reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id   UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_id)
);

CREATE INDEX idx_reviews_course ON public.reviews(course_id);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are publicly viewable"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);
