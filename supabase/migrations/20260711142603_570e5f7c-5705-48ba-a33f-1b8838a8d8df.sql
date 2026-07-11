
-- geospatial_labels
DROP POLICY IF EXISTS "geo update" ON public.geospatial_labels;
CREATE POLICY "geo update" ON public.geospatial_labels
  FOR UPDATE
  USING (owner_id = auth.uid() OR has_role(auth.uid(),'admin'::app_role))
  WITH CHECK (owner_id = auth.uid() OR has_role(auth.uid(),'admin'::app_role));

-- mission_sim_runs
DROP POLICY IF EXISTS "sim update" ON public.mission_sim_runs;
CREATE POLICY "sim update" ON public.mission_sim_runs
  FOR UPDATE
  USING (owner_id = auth.uid() OR has_role(auth.uid(),'admin'::app_role))
  WITH CHECK (owner_id = auth.uid() OR has_role(auth.uid(),'admin'::app_role));

-- sensor_fusion_datasets
DROP POLICY IF EXISTS "fusion update" ON public.sensor_fusion_datasets;
CREATE POLICY "fusion update" ON public.sensor_fusion_datasets
  FOR UPDATE
  USING (owner_id = auth.uid() OR has_role(auth.uid(),'admin'::app_role))
  WITH CHECK (owner_id = auth.uid() OR has_role(auth.uid(),'admin'::app_role));

-- red_team_probes
DROP POLICY IF EXISTS "probes update" ON public.red_team_probes;
CREATE POLICY "probes update" ON public.red_team_probes
  FOR UPDATE
  USING (
    submitted_by = auth.uid()
    OR reviewed_by = auth.uid()
    OR has_role(auth.uid(),'admin'::app_role)
  )
  WITH CHECK (
    submitted_by = auth.uid()
    OR reviewed_by = auth.uid()
    OR has_role(auth.uid(),'admin'::app_role)
  );
