
-- Research Papers
CREATE TABLE public.research_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  abstract TEXT,
  authors TEXT[],
  published_date DATE,
  pdf_url TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Research Blog Posts
CREATE TABLE public.research_blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  cover_image_url TEXT,
  author TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Frontier Leaderboards
CREATE TABLE public.frontier_leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name TEXT NOT NULL,
  provider TEXT,
  score NUMERIC,
  category TEXT,
  benchmark TEXT,
  rank INTEGER,
  evaluated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Preference Leaderboard
CREATE TABLE public.preference_leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name TEXT NOT NULL,
  provider TEXT,
  elo_score NUMERIC,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  total_comparisons INTEGER DEFAULT 0,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Research Labs
CREATE TABLE public.research_labs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  focus_area TEXT,
  lead_researcher TEXT,
  status TEXT DEFAULT 'active',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Research Careers
CREATE TABLE public.research_careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  type TEXT DEFAULT 'Full-time',
  description TEXT,
  requirements TEXT[],
  apply_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.research_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frontier_leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preference_leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_careers ENABLE ROW LEVEL SECURITY;

-- Public read access for all research tables (public-facing content)
CREATE POLICY "Public read access" ON public.research_papers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read access" ON public.research_blog_posts FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Public read access" ON public.frontier_leaderboards FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read access" ON public.preference_leaderboards FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read access" ON public.research_labs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read access" ON public.research_careers FOR SELECT TO anon, authenticated USING (is_active = true);
