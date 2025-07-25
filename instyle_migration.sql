-- Placeholder for Instyle Hair Boutique salon ID. Replace with actual UUID if available.
-- You can generate a new UUID using a tool like `SELECT gen_random_uuid();` in Supabase SQL editor.
DO $$
DECLARE
    instyle_salon_id UUID := 'a1b2c3d4-e5f6-7890-1234-567890abcdef'; -- Placeholder UUID
BEGIN

    -- Insert Instyle Hair Boutique salon
    INSERT INTO public.salons (id, name, owner_id, subdomain, custom_domain, logo_url, plan, primary_color)
    VALUES (instyle_salon_id, 'Instyle Hair Boutique', '00000000-0000-0000-0000-000000000000', 'instylehairboutique', 'www.instylehairboutique.co.za', 'https://example.com/instyle-logo.png', 'pro', '#8A2BE2')
    ON CONFLICT (id) DO NOTHING;

    -- Insert placeholder services for Instyle Hair Boutique
    INSERT INTO public.services (id, salon_id, name, duration_minutes, price, is_active)
    VALUES
        (gen_random_uuid(), instyle_salon_id, 'Haircut & Style', 60, 35000, TRUE),
        (gen_random_uuid(), instyle_salon_id, 'Color & Highlights', 180, 120000, TRUE),
        (gen_random_uuid(), instyle_salon_id, 'Deep Conditioning Treatment', 45, 50000, TRUE),
        (gen_random_uuid(), instyle_salon_id, 'Keratin Treatment', 240, 250000, TRUE),
        (gen_random_uuid(), instyle_salon_id, 'Blow Dry', 30, 20000, TRUE)
    ON CONFLICT (id) DO NOTHING;

    -- Insert placeholder profiles (clients) for Instyle Hair Boutique
    -- Note: user_id in profiles table references auth.users(id).
    -- For a real migration, these would be existing auth.users IDs or new ones created.
    -- For now, using gen_random_uuid() for id and a dummy user_id.
    INSERT INTO public.profiles (id, salon_id, full_name, phone)
    VALUES
        (gen_random_uuid(), instyle_salon_id, 'Client One', '+27810001111'),
        (gen_random_uuid(), instyle_salon_id, 'Client Two', '+27810002222'),
        (gen_random_uuid(), instyle_salon_id, 'Client Three', '+27810003333')
    ON CONFLICT (id) DO NOTHING;

END $$;
