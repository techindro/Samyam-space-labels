
-- ============ ENUMS ============
DO $$ BEGIN
  CREATE TYPE public.dataset_status AS ENUM ('draft','active','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.task_status AS ENUM ('open','in_progress','submitted','approved','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.eval_status AS ENUM ('queued','running','completed','failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.demo_status AS ENUM ('new','contacted','qualified','closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============ updated_at helper (already exists) ============

-- ============ DATASETS ============
CREATE TABLE public.datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (length(btrim(name)) > 0 AND length(name) <= 200),
  description text CHECK (description IS NULL OR length(description) <= 4000),
  domain text CHECK (domain IS NULL OR length(domain) <= 100),
  item_count integer NOT NULL DEFAULT 0 CHECK (item_count >= 0),
  status public.dataset_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.datasets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.datasets TO authenticated;
GRANT ALL ON public.datasets TO service_role;
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "datasets readable by all" ON public.datasets FOR SELECT USING (true);
CREATE POLICY "auth users create datasets" ON public.datasets FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "owner updates dataset" ON public.datasets FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "admin updates dataset" ON public.datasets FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin deletes dataset" ON public.datasets FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER datasets_updated BEFORE UPDATE ON public.datasets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ ANNOTATION TASKS ============
CREATE TABLE public.annotation_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid REFERENCES public.datasets(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  title text NOT NULL CHECK (length(btrim(title)) > 0 AND length(title) <= 200),
  instructions text CHECK (instructions IS NULL OR length(instructions) <= 4000),
  label_schema jsonb NOT NULL DEFAULT '{}'::jsonb,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  result jsonb,
  status public.task_status NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.annotation_tasks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.annotation_tasks TO authenticated;
GRANT ALL ON public.annotation_tasks TO service_role;
ALTER TABLE public.annotation_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tasks readable by all" ON public.annotation_tasks FOR SELECT USING (true);
CREATE POLICY "auth users create tasks" ON public.annotation_tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "owner/assignee updates task" ON public.annotation_tasks FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR auth.uid() = assigned_to)
  WITH CHECK (auth.uid() = created_by OR auth.uid() = assigned_to);
CREATE POLICY "admin updates task" ON public.annotation_tasks FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin deletes task" ON public.annotation_tasks FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER tasks_updated BEFORE UPDATE ON public.annotation_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ EVALUATION RUNS ============
CREATE TABLE public.evaluation_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model_name text NOT NULL CHECK (length(btrim(model_name)) > 0 AND length(model_name) <= 200),
  provider text CHECK (provider IS NULL OR length(provider) <= 100),
  benchmark text NOT NULL CHECK (length(btrim(benchmark)) > 0 AND length(benchmark) <= 200),
  score numeric,
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  status public.eval_status NOT NULL DEFAULT 'queued',
  notes text CHECK (notes IS NULL OR length(notes) <= 4000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.evaluation_runs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.evaluation_runs TO authenticated;
GRANT ALL ON public.evaluation_runs TO service_role;
ALTER TABLE public.evaluation_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "evals readable by all" ON public.evaluation_runs FOR SELECT USING (true);
CREATE POLICY "auth users create evals" ON public.evaluation_runs FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "owner updates eval" ON public.evaluation_runs FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "admin updates eval" ON public.evaluation_runs FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin deletes eval" ON public.evaluation_runs FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER evals_updated BEFORE UPDATE ON public.evaluation_runs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ PREFERENCE VOTES ============
CREATE TABLE public.preference_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt text NOT NULL CHECK (length(btrim(prompt)) > 0 AND length(prompt) <= 4000),
  model_a text NOT NULL CHECK (length(btrim(model_a)) > 0 AND length(model_a) <= 200),
  model_b text NOT NULL CHECK (length(btrim(model_b)) > 0 AND length(model_b) <= 200),
  response_a text CHECK (response_a IS NULL OR length(response_a) <= 8000),
  response_b text CHECK (response_b IS NULL OR length(response_b) <= 8000),
  winner text NOT NULL CHECK (winner IN ('a','b','tie')),
  rationale text CHECK (rationale IS NULL OR length(rationale) <= 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.preference_votes TO anon;
GRANT SELECT, INSERT, DELETE ON public.preference_votes TO authenticated;
GRANT ALL ON public.preference_votes TO service_role;
ALTER TABLE public.preference_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "votes readable by all" ON public.preference_votes FOR SELECT USING (true);
CREATE POLICY "auth users cast vote" ON public.preference_votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = voter_id);
CREATE POLICY "voter deletes own vote" ON public.preference_votes FOR DELETE TO authenticated USING (auth.uid() = voter_id);
CREATE POLICY "admin deletes vote" ON public.preference_votes FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ============ DEMO REQUESTS EXTENSION ============
ALTER TABLE public.demo_requests
  ADD COLUMN IF NOT EXISTS product_interest text CHECK (product_interest IS NULL OR length(product_interest) <= 100),
  ADD COLUMN IF NOT EXISTS status public.demo_status NOT NULL DEFAULT 'new';

-- Admins manage demo requests
DROP POLICY IF EXISTS "Admins read demo_requests" ON public.demo_requests;
CREATE POLICY "Admins read demo_requests" ON public.demo_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admins update demo_requests" ON public.demo_requests;
CREATE POLICY "Admins update demo_requests" ON public.demo_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admins delete demo_requests" ON public.demo_requests;
CREATE POLICY "Admins delete demo_requests" ON public.demo_requests FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
