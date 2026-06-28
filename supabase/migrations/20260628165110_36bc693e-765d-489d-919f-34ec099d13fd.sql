
-- 1. orbital_telemetry_streams
CREATE TABLE public.orbital_telemetry_streams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  spacecraft TEXT NOT NULL,
  mission TEXT NOT NULL,
  anomaly_count INTEGER NOT NULL DEFAULT 0,
  downlink_rate NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.orbital_telemetry_streams TO anon, authenticated;
GRANT ALL ON public.orbital_telemetry_streams TO service_role;
ALTER TABLE public.orbital_telemetry_streams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read orbital_telemetry_streams" ON public.orbital_telemetry_streams FOR SELECT USING (true);
CREATE POLICY "Admins manage orbital_telemetry_streams" ON public.orbital_telemetry_streams FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_orbital_telemetry_streams_updated_at BEFORE UPDATE ON public.orbital_telemetry_streams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. space_debris_tracks
CREATE TABLE public.space_debris_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  object_name TEXT NOT NULL,
  orbit_class TEXT NOT NULL,
  altitude_km NUMERIC NOT NULL DEFAULT 0,
  risk_level TEXT NOT NULL DEFAULT 'low',
  conjunction_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'tracked',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.space_debris_tracks TO anon, authenticated;
GRANT ALL ON public.space_debris_tracks TO service_role;
ALTER TABLE public.space_debris_tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read space_debris_tracks" ON public.space_debris_tracks FOR SELECT USING (true);
CREATE POLICY "Admins manage space_debris_tracks" ON public.space_debris_tracks FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_space_debris_tracks_updated_at BEFORE UPDATE ON public.space_debris_tracks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. lunar_surface_maps
CREATE TABLE public.lunar_surface_maps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region TEXT NOT NULL,
  mission TEXT NOT NULL,
  label_count INTEGER NOT NULL DEFAULT 0,
  resolution_m NUMERIC NOT NULL DEFAULT 0,
  sensor_type TEXT NOT NULL DEFAULT 'optical',
  status TEXT NOT NULL DEFAULT 'in_progress',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.lunar_surface_maps TO anon, authenticated;
GRANT ALL ON public.lunar_surface_maps TO service_role;
ALTER TABLE public.lunar_surface_maps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read lunar_surface_maps" ON public.lunar_surface_maps FOR SELECT USING (true);
CREATE POLICY "Admins manage lunar_surface_maps" ON public.lunar_surface_maps FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_lunar_surface_maps_updated_at BEFORE UPDATE ON public.lunar_surface_maps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. launch_trajectory_runs
CREATE TABLE public.launch_trajectory_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle TEXT NOT NULL,
  mission TEXT NOT NULL,
  delta_v_score NUMERIC NOT NULL DEFAULT 0,
  success_probability NUMERIC NOT NULL DEFAULT 0,
  outcome TEXT NOT NULL DEFAULT 'pending',
  status TEXT NOT NULL DEFAULT 'queued',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.launch_trajectory_runs TO anon, authenticated;
GRANT ALL ON public.launch_trajectory_runs TO service_role;
ALTER TABLE public.launch_trajectory_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read launch_trajectory_runs" ON public.launch_trajectory_runs FOR SELECT USING (true);
CREATE POLICY "Admins manage launch_trajectory_runs" ON public.launch_trajectory_runs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_launch_trajectory_runs_updated_at BEFORE UPDATE ON public.launch_trajectory_runs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed realistic data
INSERT INTO public.orbital_telemetry_streams (spacecraft, mission, anomaly_count, downlink_rate, status) VALUES
('Cartosat-3', 'Earth Observation', 2, 320.5, 'active'),
('RISAT-2B', 'SAR Imaging', 1, 280.0, 'active'),
('Chandrayaan-3 Propulsion', 'Lunar', 0, 64.0, 'archived'),
('Aditya-L1', 'Solar Observation', 3, 48.2, 'active'),
('GSAT-24', 'Communications', 0, 1200.0, 'active');

INSERT INTO public.space_debris_tracks (object_name, orbit_class, altitude_km, risk_level, conjunction_count, status) VALUES
('COSMOS-1408 Fragment 142', 'LEO', 485, 'high', 4, 'tracked'),
('Fengyun-1C Debris 88', 'LEO', 865, 'medium', 2, 'tracked'),
('Long March 6A Stage', 'LEO', 720, 'high', 6, 'tracked'),
('Starlink Defunct 31', 'LEO', 540, 'low', 1, 'tracked'),
('Iridium-33 Fragment', 'LEO', 780, 'medium', 3, 'tracked');

INSERT INTO public.lunar_surface_maps (region, mission, label_count, resolution_m, sensor_type, status) VALUES
('Shackleton Crater Rim', 'Chandrayaan-3', 4820, 0.3, 'optical', 'completed'),
('Mare Imbrium', 'Chandrayaan-2', 12400, 0.5, 'optical', 'completed'),
('South Pole-Aitken Basin', 'Future Lander', 1800, 1.0, 'hyperspectral', 'in_progress'),
('Oceanus Procellarum', 'Chandrayaan-2', 8200, 0.5, 'sar', 'completed'),
('Tycho Crater', 'Lunar Recon', 3600, 0.4, 'optical', 'in_progress');

INSERT INTO public.launch_trajectory_runs (vehicle, mission, delta_v_score, success_probability, outcome, status) VALUES
('PSLV-C57', 'Aditya-L1 Insertion', 0.94, 0.97, 'pass', 'completed'),
('LVM3-M4', 'Chandrayaan-3 TLI', 0.96, 0.98, 'pass', 'completed'),
('SSLV-D3', 'EOS-08 Polar', 0.88, 0.91, 'pass', 'completed'),
('GSLV F14', 'INSAT-3DS GTO', 0.92, 0.94, 'pass', 'completed'),
('LVM3 (Sim)', 'Gaganyaan G1 Sim', 0.90, 0.93, 'pending', 'running');
