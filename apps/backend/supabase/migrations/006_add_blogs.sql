-- Migration: 006_add_blogs.sql
-- Run in Supabase SQL Editor

-- ============================================================
-- 8. blogs
-- ============================================================
CREATE TABLE public.blogs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  excerpt         TEXT NOT NULL DEFAULT '',
  body_html       TEXT NOT NULL DEFAULT '',
  thumbnail_url   TEXT,
  category        TEXT NOT NULL DEFAULT 'blog',   -- 'blog' | 'news'
  author          TEXT NOT NULL DEFAULT 'Aizen',
  source_name     TEXT,
  source_url      TEXT,
  images          JSONB NOT NULL DEFAULT '[]',    -- [{ "url": "...", "caption": "..." }]
  status          TEXT NOT NULL DEFAULT 'published', -- draft | published | archived
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blogs_slug ON public.blogs(slug);
CREATE INDEX idx_blogs_category ON public.blogs(category);
CREATE INDEX idx_blogs_published_at ON public.blogs(published_at DESC);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blogs are publicly viewable"
  ON public.blogs FOR SELECT
  USING (status = 'published');
