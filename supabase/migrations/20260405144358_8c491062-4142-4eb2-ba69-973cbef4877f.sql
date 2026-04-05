
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS for user_roles: admins can read
CREATE POLICY "Admins can view roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin CRUD policies for research_papers
CREATE POLICY "Admins can insert research_papers"
ON public.research_papers FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update research_papers"
ON public.research_papers FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete research_papers"
ON public.research_papers FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin CRUD policies for research_blog_posts
CREATE POLICY "Admins can insert research_blog_posts"
ON public.research_blog_posts FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update research_blog_posts"
ON public.research_blog_posts FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete research_blog_posts"
ON public.research_blog_posts FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin CRUD policies for frontier_leaderboards
CREATE POLICY "Admins can insert frontier_leaderboards"
ON public.frontier_leaderboards FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update frontier_leaderboards"
ON public.frontier_leaderboards FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete frontier_leaderboards"
ON public.frontier_leaderboards FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin CRUD policies for preference_leaderboards
CREATE POLICY "Admins can insert preference_leaderboards"
ON public.preference_leaderboards FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update preference_leaderboards"
ON public.preference_leaderboards FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete preference_leaderboards"
ON public.preference_leaderboards FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin CRUD policies for research_labs
CREATE POLICY "Admins can insert research_labs"
ON public.research_labs FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update research_labs"
ON public.research_labs FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete research_labs"
ON public.research_labs FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin CRUD policies for research_careers
CREATE POLICY "Admins can insert research_careers"
ON public.research_careers FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update research_careers"
ON public.research_careers FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete research_careers"
ON public.research_careers FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to read all blog posts (including unpublished) and all careers (including inactive)
CREATE POLICY "Admins can read all blog posts"
ON public.research_blog_posts FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read all careers"
ON public.research_careers FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
