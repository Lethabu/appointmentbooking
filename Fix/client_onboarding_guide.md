# Complete Client Onboarding Guide - InStyle Hair Boutique

## Executive Summary
This guide provides a comprehensive onboarding process for InStyle Hair Boutique on the your-platform-domain.com platform, including dashboard setup, issue resolution, and best practices for optimal user experience.

## Current Issue Analysis

### Identified Problems from Console Logs
1. **Supabase Database Connectivity Issues**
   - 404 errors on `/rest/v1/settings`, `/rest/v1/marketing`, `/rest/v1/clients`
   - 400 error on appointments endpoint
   - Missing or incorrect database table configurations

2. **API Endpoint Failures**
   - `/api/dashboard/services` returning 500 Internal Server Error
   - Infinite retry loops causing performance issues
   - `/api/book` returning 400 errors during booking attempts

3. **Content Script Conflicts**
   - Long Running Recorder interference
   - Multiple script initializations

## Phase 1: Immediate Technical Fixes

### 1.1 Database Schema Verification
Ensure the following tables exist in Supabase:

```sql
-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id),
    key VARCHAR(255) NOT NULL,
    value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing table
CREATE TABLE IF NOT EXISTS marketing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id),
    campaign_name VARCHAR(255),
    content JSONB,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 1.2 Row Level Security (RLS) Policies
```sql
-- Enable RLS on all tables
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policies for salon-specific access
CREATE POLICY "Users can view own salon settings" ON settings
    FOR SELECT USING (salon_id = auth.jwt() ->> 'salon_id'::text);

CREATE POLICY "Users can view own salon marketing" ON marketing
    FOR SELECT USING (salon_id = auth.jwt() ->> 'salon_id'::text);

CREATE POLICY "Users can view own salon clients" ON clients
    FOR SELECT USING (salon_id = auth.jwt() ->> 'salon_id'::text);
```

### 1.3 API Route Fixes
Update the services API endpoint to handle errors gracefully:

```typescript
// /api/dashboard/services
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const salonId = searchParams.get('salon_id') || 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
    
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('salon_id', salonId);
    
    if (error) {
      console.error('Services fetch error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }
    
    return Response.json({ services: data || [] });
  } catch (err) {
    console.error('Unexpected error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## Phase 2: Client Onboarding Process

### 2.1 Pre-Onboarding Checklist
- [ ] Verify SuperSaaS migration data integrity
- [ ] Confirm salon ID: `ccb12b4d-ade6-467d-a614-7c9d198ddc70`
- [ ] Test all database connections
- [ ] Validate SSL certificates for custom domain
- [ ] Set up monitoring and logging

### 2.2 Account Setup Steps

#### Step 1: Domain Configuration
1. Update DNS records for instylehairboutique.co.za
2. Configure SSL certificate
3. Set up CDN for static assets
4. Implement proper redirects

#### Step 2: Branding & Whitelabeling
```typescript
// Brand configuration for InStyle Hair Boutique
const brandConfig = {
  name: "InStyle Hair Boutique",
  domain: "instylehairboutique.co.za",
  colors: {
    primary: "#D4A574", // Gold/Bronze
    secondary: "#2C2C2C", // Dark Grey
    accent: "#F5F5F5" // Light Grey
  },
  logo: "/assets/instyle-logo.png",
  favicon: "/assets/instyle-favicon.ico",
  contactInfo: {
    phone: "+27 XX XXX XXXX",
    email: "bookings@instylehairboutique.co.za",
    address: "Your Address Here"
  }
};
```

### 2.3 Data Migration Verification

#### Services Migration Check
```sql
SELECT 
    s.name,
    s.duration_minutes,
    s.price_cents,
    s.description,
    s.category
FROM services s 
WHERE s.salon_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'
ORDER BY s.category, s.name;
```

#### Appointments Migration Check
```sql
SELECT 
    a.scheduled_time,
    a.status,
    p.full_name as client_name,
    s.name as service_name
FROM appointments a
LEFT JOIN profiles p ON a.client_id = p.id
LEFT JOIN services s ON a.service_id = s.id
WHERE a.salon_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'
AND a.scheduled_time >= NOW()
ORDER BY a.scheduled_time;
```

## Phase 3: User Experience Optimization

### 3.1 Dashboard Enhancement Features

#### Error Handling & Loading States
```typescript
const DashboardServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/dashboard/services');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setServices(data.services || []);
      setRetryCount(0); // Reset retry count on success
      
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setError(err.message);
      
      // Implement exponential backoff for retries
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchServices();
        }, Math.pow(2, retryCount) * 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-services">
      {loading && <LoadingSpinner />}
      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={() => fetchServices()}
          retryCount={retryCount}
        />
      )}
      {services.length > 0 && (
        <ServicesList services={services} />
      )}
    </div>
  );
};
```

### 3.2 Booking Flow Optimization

#### Enhanced Booking Form
```typescript
const BookingForm = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    serviceId: '',
    dateTime: '',
    notes: ''
  });
  
  const [submitStatus, setSubmitStatus] = useState('idle');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    
    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          salonId: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Booking failed');
      }
      
      setSubmitStatus('success');
      // Show success message and redirect
      
    } catch (error) {
      console.error('Booking error:', error);
      setSubmitStatus('error');
      // Show error message to user
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="booking-form">
      {/* Form fields */}
      <button 
        type="submit" 
        disabled={submitStatus === 'submitting'}
        className="submit-button"
      >
        {submitStatus === 'submitting' ? 'Booking...' : 'Book Appointment'}
      </button>
    </form>
  );
};
```

## Phase 4: Training & Documentation

### 4.1 Client Training Materials

#### Dashboard Navigation Guide
1. **Appointments Overview**
   - View today's schedule
   - Manage upcoming bookings
   - Handle cancellations/reschedules

2. **Client Management**
   - Add new clients
   - View client history
   - Update contact information

3. **Service Management**
   - Add/edit services
   - Set pricing and duration
   - Manage service categories

4. **Settings & Configuration**
   - Business hours setup
   - Notification preferences
   - Staff management

### 4.2 Best Practices Guide

#### Daily Operations
- Start each day by reviewing the appointment schedule
- Check for any overnight bookings or cancellations
- Verify client contact information before appointments
- Update service availability in real-time

#### Customer Communication
- Send automated confirmation emails
- Set up reminder notifications (24h and 2h before)
- Follow up with clients after appointments
- Handle special requests professionally

## Phase 5: Monitoring & Maintenance

### 5.1 Performance Monitoring
```typescript
// Implement error tracking
const logError = (error, context) => {
  console.error(`[${context}] Error:`, error);
  
  // Send to monitoring service
  fetch('/api/log-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      salonId: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'
    })
  });
};
```

### 5.2 Health Checks
```typescript
// API health check endpoint
export async function GET() {
  try {
    const checks = {
      database: await checkDatabaseConnection(),
      services: await checkServicesAPI(),
      booking: await checkBookingAPI(),
      timestamp: new Date().toISOString()
    };
    
    const allHealthy = Object.values(checks).every(check => 
      typeof check === 'boolean' ? check : true
    );
    
    return Response.json(checks, { 
      status: allHealthy ? 200 : 503 
    });
  } catch (error) {
    return Response.json({ 
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}
```

## Support & Troubleshooting

### Common Issues & Solutions

1. **"Services not loading"**
   - Check database connection
   - Verify RLS policies
   - Clear browser cache

2. **"Booking failed"**
   - Validate form data
   - Check service availability
   - Verify salon_id parameter

3. **"Dashboard blank/white screen"**
   - Check console for JavaScript errors
   - Verify authentication status
   - Test in incognito mode

### Emergency Contacts
- **Technical Support**: [Your Contact]
- **Platform Issues**: [Your Contact]
- **Billing Questions**: [Your Contact]

## Success Metrics

Track these KPIs to measure onboarding success:
- Dashboard load time < 3 seconds
- Booking completion rate > 95%
- User satisfaction score > 4.5/5
- Zero critical errors in first 30 days

## Next Steps

1. **Week 1**: Complete technical fixes and database setup
2. **Week 2**: Implement dashboard improvements and testing
3. **Week 3**: Conduct user training and feedback collection
4. **Week 4**: Performance optimization and final adjustments

---

*This guide is a living document and should be updated as the platform evolves and new features are added.*