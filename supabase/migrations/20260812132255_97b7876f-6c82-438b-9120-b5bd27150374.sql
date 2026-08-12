
-- Claim an unassigned open task for yourself
CREATE POLICY "claim unassigned task"
ON public.annotation_tasks
FOR UPDATE
TO authenticated
USING (assigned_to IS NULL AND status = 'open')
WITH CHECK (assigned_to = auth.uid());

-- Claim review of a submitted task you did not create or annotate
CREATE POLICY "claim review of submitted task"
ON public.annotation_tasks
FOR UPDATE
TO authenticated
USING (
  reviewer_id IS NULL
  AND status = 'submitted'
  AND created_by <> auth.uid()
  AND (assigned_to IS NULL OR assigned_to <> auth.uid())
)
WITH CHECK (reviewer_id = auth.uid());

-- Reviewer can act on tasks assigned to them for review
CREATE POLICY "reviewer updates reviewed task"
ON public.annotation_tasks
FOR UPDATE
TO authenticated
USING (reviewer_id = auth.uid() AND created_by <> auth.uid() AND (assigned_to IS NULL OR assigned_to <> auth.uid()))
WITH CHECK (reviewer_id = auth.uid());
