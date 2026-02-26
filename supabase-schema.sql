-- Phlebotomy Schools Directory — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- ============================================
-- SCHOOLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  state_code TEXT NOT NULL,
  website TEXT,
  program_type TEXT CHECK (program_type IN ('online', 'hybrid', 'in-person')),
  tuition_low INTEGER,
  tuition_high INTEGER,
  program_length_weeks INTEGER,
  program_length_display TEXT,
  accreditation TEXT[] DEFAULT '{}',
  certifications_prepared TEXT[] DEFAULT '{}',
  financial_aid BOOLEAN DEFAULT false,
  externship_included BOOLEAN DEFAULT false,
  externship_hours INTEGER,
  highlights TEXT[] DEFAULT '{}',
  national BOOLEAN DEFAULT false,
  description TEXT,
  logo_url TEXT,
  rating NUMERIC(3,2) DEFAULT 0,
  vote_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_schools_state_code ON schools(state_code);
CREATE INDEX idx_schools_slug ON schools(slug);
CREATE INDEX idx_schools_program_type ON schools(program_type);

-- ============================================
-- SCHOOL VOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS school_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  ip_hash TEXT NOT NULL,
  fingerprint TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_votes_school ON school_votes(school_id);
CREATE INDEX idx_votes_ip ON school_votes(ip_hash);
CREATE INDEX idx_votes_created ON school_votes(created_at);

-- Rate limit: 1 vote per school per IP per month
CREATE UNIQUE INDEX idx_votes_unique_monthly 
  ON school_votes(school_id, ip_hash, (DATE_TRUNC('month', created_at)));

-- ============================================
-- BLOG POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  body TEXT NOT NULL,
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  author TEXT DEFAULT 'PhlebFind',
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_blog_slug ON blog_posts(slug);
CREATE INDEX idx_blog_status ON blog_posts(status);
CREATE INDEX idx_blog_published ON blog_posts(published_at);

-- ============================================
-- LEAD CAPTURES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  state_code TEXT,
  school_id UUID REFERENCES schools(id),
  source TEXT DEFAULT 'directory',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_leads_email ON leads(email);

-- ============================================
-- AUTO-UPDATE updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER schools_updated_at
  BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Public read access for schools and published blog posts
CREATE POLICY "Schools are publicly readable" ON schools FOR SELECT USING (true);
CREATE POLICY "Published blogs are publicly readable" ON blog_posts FOR SELECT USING (status = 'published');

-- Service role can do everything (for bots)
CREATE POLICY "Service role full access schools" ON schools FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access blogs" ON blog_posts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access votes" ON school_votes FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access leads" ON leads FOR ALL USING (auth.role() = 'service_role');

-- Anyone can vote (insert only)
CREATE POLICY "Anyone can vote" ON school_votes FOR INSERT WITH CHECK (true);

-- Anyone can submit a lead
CREATE POLICY "Anyone can submit lead" ON leads FOR INSERT WITH CHECK (true);
