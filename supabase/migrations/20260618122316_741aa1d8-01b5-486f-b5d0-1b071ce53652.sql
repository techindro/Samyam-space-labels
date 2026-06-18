
-- Restrict sensitive tables to authenticated users
DROP POLICY IF EXISTS "tasks readable by all" ON public.annotation_tasks;
CREATE POLICY "tasks readable by authenticated"
  ON public.annotation_tasks FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "evals readable by all" ON public.evaluation_runs;
CREATE POLICY "evals readable by authenticated"
  ON public.evaluation_runs FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "votes readable by all" ON public.preference_votes;
CREATE POLICY "votes readable by authenticated"
  ON public.preference_votes FOR SELECT
  TO authenticated USING (true);

-- Datasets: hide drafts/archived from anon; authenticated can see all
DROP POLICY IF EXISTS "datasets readable by all" ON public.datasets;
CREATE POLICY "active datasets readable by anon"
  ON public.datasets FOR SELECT
  TO anon USING (status = 'active');
CREATE POLICY "datasets readable by authenticated"
  ON public.datasets FOR SELECT
  TO authenticated USING (true);

-- Avatars bucket: explicit public read policy for defense-in-depth
DROP POLICY IF EXISTS "Public can read avatars" ON storage.objects;
CREATE POLICY "Public can read avatars"
  ON storage.objects FOR SELECT
  TO public USING (bucket_id = 'avatars');

-- Lock down SECURITY DEFINER helper/trigger functions from public execution
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
-- authenticated retains EXECUTE on has_role since RLS policies invoke it as the calling user
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
