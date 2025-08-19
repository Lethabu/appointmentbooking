-- Advanced Features Migration for Instyle Platform

-- WhatsApp Reminders Table
CREATE TABLE IF NOT EXISTS whatsapp_reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    send_at TIMESTAMP WITH TIME ZONE NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    user_session VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Media Posts Table
CREATE TABLE IF NOT EXISTS social_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL,
    post_id VARCHAR(100),
    content TEXT,
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    posted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing Campaigns Table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    target_audience JSONB,
    content JSONB,
    status VARCHAR(20) DEFAULT 'draft',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client Preferences Table
CREATE TABLE IF NOT EXISTS client_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    preferred_services TEXT[],
    preferred_times JSONB,
    communication_preferences JSONB,
    special_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE whatsapp_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Tenant can manage WhatsApp reminders" ON whatsapp_reminders
    FOR ALL USING (
        appointment_id IN (
            SELECT id FROM appointments WHERE tenant_id = auth.jwt() ->> 'tenant_id'::text
        )
    );

CREATE POLICY "Tenant can view analytics events" ON analytics_events
    FOR SELECT USING (tenant_id::text = auth.jwt() ->> 'tenant_id'::text);

CREATE POLICY "Tenant can manage social posts" ON social_posts
    FOR ALL USING (tenant_id::text = auth.jwt() ->> 'tenant_id'::text);

CREATE POLICY "Tenant can manage marketing campaigns" ON marketing_campaigns
    FOR ALL USING (tenant_id::text = auth.jwt() ->> 'tenant_id'::text);

-- Advanced Analytics Function
CREATE OR REPLACE FUNCTION get_advanced_analytics(tenant_uuid uuid, date_range interval DEFAULT '30 days')
RETURNS TABLE (
    total_bookings bigint,
    conversion_rate numeric,
    avg_booking_value numeric,
    repeat_client_rate numeric,
    popular_times jsonb,
    service_performance jsonb
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM appointments 
         WHERE tenant_id = tenant_uuid 
         AND created_at >= NOW() - date_range) as total_bookings,
        
        (SELECT CASE 
            WHEN COUNT(*) > 0 THEN 
                (COUNT(*) FILTER (WHERE status = 'confirmed')::numeric / COUNT(*)::numeric) * 100
            ELSE 0 
         END
         FROM appointments 
         WHERE tenant_id = tenant_uuid 
         AND created_at >= NOW() - date_range) as conversion_rate,
        
        (SELECT COALESCE(AVG(s.price), 0) FROM appointments a
         JOIN services s ON a.service_id = s.id
         WHERE a.tenant_id = tenant_uuid 
         AND a.created_at >= NOW() - date_range) as avg_booking_value,
        
        (SELECT CASE 
            WHEN COUNT(DISTINCT customer_id) > 0 THEN
                (COUNT(*) - COUNT(DISTINCT customer_id))::numeric / COUNT(DISTINCT customer_id)::numeric * 100
            ELSE 0 
         END
         FROM appointments 
         WHERE tenant_id = tenant_uuid 
         AND created_at >= NOW() - date_range) as repeat_client_rate,
        
        (SELECT jsonb_build_object(
            'morning', COUNT(*) FILTER (WHERE EXTRACT(hour FROM start_time::time) BETWEEN 9 AND 11),
            'afternoon', COUNT(*) FILTER (WHERE EXTRACT(hour FROM start_time::time) BETWEEN 12 AND 14),
            'evening', COUNT(*) FILTER (WHERE EXTRACT(hour FROM start_time::time) BETWEEN 15 AND 17)
         ) FROM appointments 
         WHERE tenant_id = tenant_uuid 
         AND created_at >= NOW() - date_range) as popular_times,
        
        (SELECT jsonb_agg(jsonb_build_object(
            'service_name', s.name,
            'booking_count', COUNT(a.id),
            'revenue', SUM(s.price)
         ))
         FROM services s
         LEFT JOIN appointments a ON s.id = a.service_id 
         WHERE s.tenant_id = tenant_uuid 
         AND (a.created_at >= NOW() - date_range OR a.created_at IS NULL)
         GROUP BY s.id, s.name) as service_performance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic reminder scheduling
CREATE OR REPLACE FUNCTION schedule_appointment_reminders()
RETURNS TRIGGER AS $$
BEGIN
    -- Only schedule reminders for confirmed appointments
    IF NEW.status = 'confirmed' THEN
        -- Schedule 24h reminder
        INSERT INTO whatsapp_reminders (appointment_id, phone, message, send_at)
        SELECT 
            NEW.id,
            c.phone,
            'Hi ' || c.name || '! Reminder: Your ' || s.name || ' appointment at Instyle Hair Boutique is tomorrow at ' || NEW.start_time || '. See you soon! 💇♀️',
            (NEW.appointment_date || ' ' || NEW.start_time)::timestamp - interval '24 hours'
        FROM customers c, services s
        WHERE c.id = NEW.customer_id AND s.id = NEW.service_id;
        
        -- Schedule 2h reminder
        INSERT INTO whatsapp_reminders (appointment_id, phone, message, send_at)
        SELECT 
            NEW.id,
            c.phone,
            'Hi ' || c.name || '! Your ' || s.name || ' appointment is in 2 hours at ' || NEW.start_time || '. We\'re ready for you! ✨',
            (NEW.appointment_date || ' ' || NEW.start_time)::timestamp - interval '2 hours'
        FROM customers c, services s
        WHERE c.id = NEW.customer_id AND s.id = NEW.service_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER appointment_reminder_trigger
    AFTER INSERT OR UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION schedule_appointment_reminders();