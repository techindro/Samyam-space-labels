CREATE TABLE public.dataset_files (
  id uuid primary key default gen_random_uuid(),
  dataset_id uuid references public.datasets(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  media_type text not null default 'image',
  mime_type text,
  size_bytes bigint not null default 0,
  preview_url text,
  status text not null default 'uploaded',
  task_id uuid references public.annotation_tasks(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.dataset_files TO authenticated;
GRANT ALL ON public.dataset_files TO service_role;

ALTER TABLE public.dataset_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners view their dataset files" ON public.dataset_files
  FOR SELECT TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owners insert their dataset files" ON public.dataset_files
  FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners update their dataset files" ON public.dataset_files
  FOR UPDATE TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owners delete their dataset files" ON public.dataset_files
  FOR DELETE TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER dataset_files_updated
  BEFORE UPDATE ON public.dataset_files
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX dataset_files_owner_idx ON public.dataset_files(owner_id);
CREATE INDEX dataset_files_dataset_idx ON public.dataset_files(dataset_id);

CREATE POLICY "Users read own dataset uploads" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'dataset-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users upload own dataset uploads" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'dataset-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own dataset uploads" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'dataset-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own dataset uploads" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'dataset-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);