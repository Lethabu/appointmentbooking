interface ErrorContext {
  severity?: 'low' | 'medium' | 'high' | 'critical';
  context?: string;
  [key: string]: any;
}

interface BookingData {
  clientName: string;
  serviceId: string;
  scheduledTime: string;
  clientPhone: string;
  tenantId: string;
  channel: string;
}

interface DemoData {
  name: string;
  email: string;
  salonName: string;
  phone?: string;
  source?: string;
}

// Custom error tracking
export function trackError(error: Error, context: ErrorContext = {}): void {
  console.error('Error tracked:', error, context);

  // Send to monitoring service
  if (typeof window !== 'undefined') {
    // Send alert for critical errors
    if (context.severity === 'critical') {
      fetch('/api/alert-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'critical_error',
          error: error.message,
          context,
        }),
      }).catch(console.error);
    }
  }
}

// Business metrics tracking
export function trackBooking(bookingData: BookingData): void {
  console.log('Booking tracked:', bookingData);

  if (typeof window !== 'undefined') {
    // Send booking notification
    fetch('/api/alert-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'new_booking',
        booking: bookingData,
      }),
    }).catch(console.error);
  }
}

export function trackDemoRequest(demoData: DemoData): void {
  console.log('Demo request tracked:', demoData);

  if (typeof window !== 'undefined') {
    fetch('/api/alert-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'new_demo',
        demo: demoData,
      }),
    }).catch(console.error);
  }
}

// AI Agent interaction tracking
export function trackAgentInteraction(
  agentName: string,
  messageType: string,
): void {
  console.log('AI interaction:', { agent: agentName, type: messageType });
}
