
-- Revoke EXECUTE on has_role from anon/authenticated. RLS policies still work since SECURITY DEFINER runs as owner regardless.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;

-- Tighten demo_requests INSERT policy: require non-empty name & valid-looking email
DROP POLICY IF EXISTS "Anyone can submit a demo request" ON public.demo_requests;
CREATE POLICY "Anyone can submit a demo request"
ON public.demo_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(name)) > 0
  AND length(btrim(email)) > 0
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(name) <= 200
  AND length(email) <= 320
  AND (message IS NULL OR length(message) <= 5000)
);

-- Remove broad listing policy on avatars bucket. Public URLs still serve files; this just blocks the list API.
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
