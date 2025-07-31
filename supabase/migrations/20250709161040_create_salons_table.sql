CREATE TABLE public.salons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    owner_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL
);