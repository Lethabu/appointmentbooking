-- Add staff_id to appointments table
ALTER TABLE public.appointments
ADD COLUMN staff_id UUID REFERENCES public.staff(id);

-- Add RLS policy for staff_id in appointments table
CREATE POLICY "Allow update on own tenant appointments by staff_id"
ON public.appointments
FOR UPDATE
USING (staff_id IN (SELECT id FROM public.staff WHERE salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid())))
WITH CHECK (staff_id IN (SELECT id FROM public.staff WHERE salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid())));

CREATE POLICY "Allow insert on own tenant appointments by staff_id"
ON public.appointments
FOR INSERT
WITH CHECK (staff_id IN (SELECT id FROM public.staff WHERE salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid())));
