
CREATE TABLE public.demo_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can submit a demo request"
ON public.demo_requests
FOR INSERT
WITH CHECK (true);

-- Only authenticated admins could read (for now, no public reads)
CREATE POLICY "No public reads"
ON public.demo_requests
FOR SELECT
USING (false);
