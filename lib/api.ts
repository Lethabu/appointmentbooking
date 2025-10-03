<<<<<<< HEAD
import { supabase } from './supabase';
import type { Service, Appointment, Product, BookingFormData } from '@/types';
=======
import { supabase } from "./supabase"
import type { Service, Appointment, Product, BookingFormData } from "@/types"
>>>>>>> origin/feat/instyle-whitelabel

interface ChatResponse {
  reply: string;
  agent: string;
}

interface AgentSuggestion {
  id: string;
  text: string;
}

class ApiClient {
<<<<<<< HEAD
  private supabase = supabase;
=======
  private supabase = supabase
>>>>>>> origin/feat/instyle-whitelabel

  // Services
  async getServices(tenantId: string): Promise<Service[]> {
    const { data, error } = await this.supabase
      .from('services')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .order('category', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async createService(
    service: Omit<Service, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Service> {
    const { data, error } = await this.supabase
      .from('services')
      .insert(service)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    const { data, error } = await this.supabase
      .from('services')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteService(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Products
  async getProducts(tenantId: string): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('is_active', true);

    if (error) throw error;
    return data || [];
  }

  // Appointments
  async getAppointments(
    tenantId: string,
    filters?: {
      date?: string;
      status?: string;
    },
  ): Promise<Appointment[]> {
    let query = this.supabase
      .from('appointments')
      .select('*')
      .eq('tenant_id', tenantId);

    if (filters?.date) {
      query = query.eq('date', filters.date);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async createBooking(
    bookingData: BookingFormData & { tenantId: string },
  ): Promise<Appointment[]> {
    const appointments = bookingData.selected_services.map((service) => ({
      tenant_id: bookingData.tenantId,
      client_name: bookingData.full_name,
      client_phone: bookingData.phone_number,
      client_email: bookingData.email,
      service_id: service.id,
      service_name: service.name,
      date:
        bookingData.preferred_date || new Date().toISOString().split('T')[0],
      time: bookingData.preferred_time || '09:00',
      duration: service.duration,
      price: service.price,
      status: 'pending' as const,
      notes: bookingData.notes,
    }));

    const { data, error } = await this.supabase
      .from('appointments')
      .insert(appointments)
      .select();

    if (error) throw error;
    return data || [];
  }

  async updateAppointmentStatus(
    id: string,
    status: Appointment['status'],
  ): Promise<Appointment> {
    const { data, error } = await this.supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // AI Agent Integration
  async sendChatMessage(
    message: string,
    agentId: string,
    tenantId: string,
  ): Promise<ChatResponse> {
    const response = await fetch('/api/agent/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        agent_id: agentId,
        tenant_id: tenantId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  }

  async getAgentSuggestions(tenantId: string): Promise<AgentSuggestion[]> {
    const response = await fetch(`/api/agent/suggest?tenant_id=${tenantId}`);

    if (!response.ok) {
      throw new Error('Failed to get suggestions');
    }

    return response.json();
  }
}

export const api = new ApiClient();
