-- POPIA Compliance Migration for South African Data Protection

-- Consent Records Table
CREATE TABLE IF NOT EXISTS consent_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    consent_type VARCHAR(50) NOT NULL,
    purpose TEXT NOT NULL,
    data_categories TEXT[],
    consent_given BOOLEAN NOT NULL,
    consent_date TIMESTAMP WITH TIME ZONE NOT NULL,
    consent_withdrawn_date TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data Processing Activities Table
CREATE TABLE IF NOT EXISTS data_processing_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    activity_name VARCHAR(255) NOT NULL,
    purpose TEXT NOT NULL,
    data_categories TEXT[],
    legal_basis VARCHAR(100) NOT NULL,
    retention_period INTERVAL,
    third_party_sharing BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data Subject Requests Table
CREATE TABLE IF NOT EXISTS data_subject_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    customer_email VARCHAR(255) NOT NULL,
    request_type VARCHAR(50) NOT NULL, -- 'access', 'correction', 'deletion', 'objection'
    request_details TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    verification_token VARCHAR(255),
    verification_expires_at TIMESTAMP WITH TIME ZONE,
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Log Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all compliance tables
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_processing_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_subject_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenant isolation
CREATE POLICY "Tenant can manage consent records" ON consent_records
    FOR ALL USING (tenant_id::text = auth.jwt() ->> 'tenant_id'::text);

CREATE POLICY "Tenant can manage processing activities" ON data_processing_activities
    FOR ALL USING (tenant_id::text = auth.jwt() ->> 'tenant_id'::text);

CREATE POLICY "Tenant can manage data subject requests" ON data_subject_requests
    FOR ALL USING (tenant_id::text = auth.jwt() ->> 'tenant_id'::text);

CREATE POLICY "Tenant can view audit logs" ON audit_logs
    FOR SELECT USING (tenant_id::text = auth.jwt() ->> 'tenant_id'::text);

-- Function to automatically log data changes
CREATE OR REPLACE FUNCTION log_data_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        tenant_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values
    ) VALUES (
        COALESCE(NEW.tenant_id, OLD.tenant_id),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply audit logging to sensitive tables
CREATE TRIGGER customers_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON customers
    FOR EACH ROW EXECUTE FUNCTION log_data_changes();

CREATE TRIGGER appointments_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON appointments
    FOR EACH ROW EXECUTE FUNCTION log_data_changes();

-- Data retention function
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS void AS $$
BEGIN
    -- Delete old audit logs (keep for 7 years as per POPIA)
    DELETE FROM audit_logs 
    WHERE created_at < NOW() - INTERVAL '7 years';
    
    -- Delete expired verification tokens
    DELETE FROM data_subject_requests 
    WHERE verification_expires_at < NOW() 
    AND status = 'pending';
    
    -- Delete withdrawn consents older than retention period
    DELETE FROM consent_records 
    WHERE consent_withdrawn_date IS NOT NULL 
    AND consent_withdrawn_date < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Function to handle data subject deletion requests
CREATE OR REPLACE FUNCTION process_data_deletion(customer_email_param TEXT, tenant_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
    customer_record customers%ROWTYPE;
BEGIN
    -- Find customer
    SELECT * INTO customer_record 
    FROM customers 
    WHERE email = customer_email_param 
    AND tenant_id = tenant_id_param;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Anonymize appointments (keep for business records but remove personal data)
    UPDATE appointments 
    SET customer_id = NULL,
        notes = 'Customer data deleted per POPIA request'
    WHERE customer_id = customer_record.id;
    
    -- Delete customer record
    DELETE FROM customers WHERE id = customer_record.id;
    
    -- Log the deletion
    INSERT INTO audit_logs (
        tenant_id,
        action,
        resource_type,
        resource_id,
        old_values
    ) VALUES (
        tenant_id_param,
        'POPIA_DELETION',
        'customers',
        customer_record.id,
        to_jsonb(customer_record)
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default data processing activities for Instyle
INSERT INTO data_processing_activities (
    tenant_id,
    activity_name,
    purpose,
    data_categories,
    legal_basis,
    retention_period
) VALUES 
(
    'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
    'Appointment Booking',
    'To schedule and manage hair installation appointments',
    ARRAY['name', 'phone', 'email', 'appointment_preferences'],
    'Legitimate Interest',
    INTERVAL '3 years'
),
(
    'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
    'WhatsApp Reminders',
    'To send appointment reminders and confirmations',
    ARRAY['name', 'phone', 'appointment_details'],
    'Consent',
    INTERVAL '1 year'
),
(
    'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
    'Marketing Communications',
    'To send promotional offers and service updates',
    ARRAY['name', 'email', 'service_preferences'],
    'Consent',
    INTERVAL '2 years'
)
ON CONFLICT DO NOTHING;