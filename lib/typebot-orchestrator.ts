// Typebot AI Orchestration for Appointment Booking

export interface TypebotFlow {
  id: string;
  variables: Record<string, any>;
}

export class TypebotOrchestrator {
  private apiUrl = process.env.TYPEBOT_API_URL!;
  private token = process.env.TYPEBOT_API_TOKEN!;

  async triggerBookingFlow(data: {
    customerName: string;
    customerPhone: string;
    serviceName: string;
    tenantId: string;
    appointmentId: string;
  }) {
    return this.executeFlow('booking-confirmation', {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      serviceName: data.serviceName,
      tenantId: data.tenantId,
      appointmentId: data.appointmentId,
      whatsappNumber: await this.getTenantWhatsApp(data.tenantId),
    });
  }

  async triggerReminderFlow(data: {
    customerName: string;
    customerPhone: string;
    appointmentTime: string;
    serviceName: string;
    tenantId: string;
  }) {
    return this.executeFlow('appointment-reminder', {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      appointmentTime: data.appointmentTime,
      serviceName: data.serviceName,
      tenantId: data.tenantId,
    });
  }

  async triggerAIChat(message: string, tenantId: string) {
    return this.executeFlow('ai-chat-assistant', {
      userMessage: message,
      tenantId: tenantId,
      geminiApiKey: process.env.GEMINI_API_KEY,
    });
  }

  // Agent Integration Trigger: For AI agent actions post-booking or events
  async triggerAgentAction(actionType: 'reminder' | 'confirmation' | 'analytics' | 'chat_support', data: {
    tenantId: string;
    bookingId?: string;
    customerId?: string;
    message?: string;
  }) {
    // RLS: All Supabase ops filtered by tenantId
    const { supabase } = await import('./supabase');
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('id', data.tenantId)
      .single(); // Enforces RLS via policy

    if (!tenant) {
      throw new Error('Invalid tenant for agent action');
    }

    let flowId: string;
    let variables: Record<string, any> = { tenantId: data.tenantId };

    switch (actionType) {
      case 'reminder':
        flowId = 'agent-reminder';
        variables = { ...variables, bookingId: data.bookingId, customerId: data.customerId };
        break;
      case 'confirmation':
        flowId = 'agent-confirmation';
        variables = { ...variables, bookingId: data.bookingId };
        break;
      case 'analytics':
        flowId = 'agent-analytics';
        // Log to Supabase analytics table (RLS)
        await supabase.from('agent_analytics').insert({
          tenant_id: data.tenantId,
          action_type: 'analytics',
          data: { customerId: data.customerId }
        });
        return { success: true }; // No flow needed
      case 'chat_support':
        flowId = 'agent-chat-support';
        variables = { ...variables, message: data.message, customerId: data.customerId };
        break;
      default:
        throw new Error('Unknown agent action type');
    }

    // Log agent trigger (for audit, RLS enforced)
    await supabase.from('agent_triggers').insert({
      type: actionType,
      tenant_id: data.tenantId,
      data: variables,
      triggered_at: new Date().toISOString()
    });

    return this.executeFlow(flowId, variables);
  }

  private async executeFlow(flowId: string, variables: Record<string, any>) {
    try {
      const response = await fetch(
        `${this.apiUrl}/typebots/${flowId}/startChat`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isStreamEnabled: false,
            variables,
          }),
        },
      );

      return await response.json();
    } catch (error) {
      console.error('Typebot flow execution error:', error);
      return { error: 'Flow execution failed' };
    }
  }

  private async getTenantWhatsApp(tenantId: string): Promise<string> {
    // Fetch tenant WhatsApp number from Supabase
    const { supabase } = await import('./supabase');
    const { data } = await supabase
      .from('tenants')
      .select('branding')
      .eq('id', tenantId)
      .single();

    return data?.branding?.whatsappNumber || '+27123456789';
  }
}

export const typebotOrchestrator = new TypebotOrchestrator();
