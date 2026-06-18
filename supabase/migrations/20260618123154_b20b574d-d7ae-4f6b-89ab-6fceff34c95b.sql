
CREATE TABLE public.geospatial_labels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sensor_type text NOT NULL CHECK (sensor_type IN ('EO','SAR','IR','MULTI')),
  region text,
  image_count int NOT NULL DEFAULT 0,
  label_count int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','archived')),
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.geospatial_labels TO authenticated;
GRANT ALL ON public.geospatial_labels TO service_role;
ALTER TABLE public.geospatial_labels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "geo readable" ON public.geospatial_labels FOR SELECT TO authenticated USING (true);
CREATE POLICY "geo insert" ON public.geospatial_labels FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'contributor') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "geo update" ON public.geospatial_labels FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'contributor') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "geo delete" ON public.geospatial_labels FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER geo_updated_at BEFORE UPDATE ON public.geospatial_labels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.sensor_fusion_datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  modalities text[] NOT NULL DEFAULT '{}',
  record_count int NOT NULL DEFAULT 0,
  quality_score numeric(4,2),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','archived')),
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sensor_fusion_datasets TO authenticated;
GRANT ALL ON public.sensor_fusion_datasets TO service_role;
ALTER TABLE public.sensor_fusion_datasets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fusion readable" ON public.sensor_fusion_datasets FOR SELECT TO authenticated USING (true);
CREATE POLICY "fusion insert" ON public.sensor_fusion_datasets FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'contributor') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "fusion update" ON public.sensor_fusion_datasets FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'contributor') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "fusion delete" ON public.sensor_fusion_datasets FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER fusion_updated_at BEFORE UPDATE ON public.sensor_fusion_datasets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.mission_sim_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario text NOT NULL,
  model_name text NOT NULL,
  kpi_score numeric(5,2),
  outcome text CHECK (outcome IN ('pass','fail','partial')),
  notes text,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','completed','failed')),
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mission_sim_runs TO authenticated;
GRANT ALL ON public.mission_sim_runs TO service_role;
ALTER TABLE public.mission_sim_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sim readable" ON public.mission_sim_runs FOR SELECT TO authenticated USING (true);
CREATE POLICY "sim insert" ON public.mission_sim_runs FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'contributor') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "sim update" ON public.mission_sim_runs FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'contributor') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "sim delete" ON public.mission_sim_runs FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER sim_updated_at BEFORE UPDATE ON public.mission_sim_runs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.red_team_probes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt text NOT NULL,
  response text,
  category text NOT NULL,
  severity text NOT NULL DEFAULT 'low' CHECK (severity IN ('low','medium','high','critical')),
  reviewer_signoff boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','triaged','mitigated','dismissed')),
  submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.red_team_probes TO authenticated;
GRANT ALL ON public.red_team_probes TO service_role;
ALTER TABLE public.red_team_probes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "probes readable" ON public.red_team_probes FOR SELECT TO authenticated USING (true);
CREATE POLICY "probes insert" ON public.red_team_probes FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'contributor') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "probes update" ON public.red_team_probes FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'contributor') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "probes delete" ON public.red_team_probes FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER probes_updated_at BEFORE UPDATE ON public.red_team_probes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
