DROP POLICY IF EXISTS "probes update" ON public.red_team_probes;
CREATE POLICY "probes update" ON public.red_team_probes
FOR UPDATE
USING ((submitted_by = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (
  (
    (submitted_by = auth.uid() AND (reviewed_by IS NULL OR reviewed_by <> auth.uid()))
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);