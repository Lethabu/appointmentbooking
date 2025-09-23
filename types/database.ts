export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      services: {
        Row: {
          id: string
          tenant_id: string
          name: string
          description: string | null
          price: number
          duration: number
          category: string | null
          active: boolean
          created_at: string
          updated_at: string
        };
        Insert: {
          id?: string
          tenant_id: string
          name: string
          description?: string | null
          price: number
          duration: number
          category?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        };
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          description?: string | null
          price?: number
          duration?: number
          category?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        };
      };
      appointments: {
        Row: {
          id: string
          tenant_id: string
          service_id: string
          customer_id: string | null
          staff_id: string | null
          datetime: string
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          notes: string | null
          price: number
          created_at: string
          updated_at: string
          client_name: string
          service_name: string
          client_phone: string | null
          time: string | null
        };
        Insert: {
          id?: string
          tenant_id: string
          service_id: string
          customer_id?: string | null
          staff_id?: string | null
          datetime: string
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          notes?: string | null
          price: number
          created_at?: string
          updated_at?: string
          client_name: string
          service_name: string
          client_phone?: string | null
          time?: string | null
        };
        Update: {
          id?: string
          tenant_id?: string
          service_id?: string
          customer_id?: string | null
          staff_id?: string | null
          datetime?: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          notes?: string | null
          price?: number
          created_at?: string
          updated_at?: string
          client_name?: string
          service_name?: string
          client_phone?: string | null
          time?: string | null
        };
      };
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}
