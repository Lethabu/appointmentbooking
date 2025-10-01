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
      salons: {
        Row: {
          id: string
          name: string
          owner_id: string
          subdomain: string | null
          custom_domain: string | null
          logo_url: string | null
          primary_color: string | null
          plan: string
          trial_ends_at: string | null
          subscription_status: string | null
          billing_cycle: string
          last_billed_at: string | null
          next_billing_date: string | null
          api_enabled: boolean
          whatsapp_enabled: boolean
          pricing_model: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          subdomain?: string | null
          custom_domain?: string | null
          logo_url?: string | null
          primary_color?: string | null
          plan?: string
          trial_ends_at?: string | null
          subscription_status?: string | null
          billing_cycle?: string
          last_billed_at?: string | null
          next_billing_date?: string | null
          api_enabled?: boolean
          whatsapp_enabled?: boolean
          pricing_model?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          subdomain?: string | null
          custom_domain?: string | null
          logo_url?: string | null
          primary_color?: string | null
          plan?: string
          trial_ends_at?: string | null
          subscription_status?: string | null
          billing_cycle?: string
          last_billed_at?: string | null
          next_billing_date?: string | null
          api_enabled?: boolean
          whatsapp_enabled?: boolean
          pricing_model?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "salons_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          salon_id: string
          full_name: string | null
          phone: string | null
          created_at: string
        }
        Insert: {
          id: string
          salon_id: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          salon_id?: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_salon_id_fkey"
            columns: ["salon_id"]
            referencedRelation: "salons"
            referencedColumns: ["id"]
          }
        ]
      }
      staff_members: {
        Row: {
          id: string
          salon_id: string
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          salon_id: string
          user_id: string
          role: string
          created_at?: string
        }
        Update: {
          id?: string
          salon_id?: string
          user_id?: string
          role?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_members_salon_id_fkey"
            columns: ["salon_id"]
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_members_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      staff_invites: {
        Row: {
          id: string
          salon_id: string
          email: string
          role: string
          invited_by: string | null
          token: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          salon_id: string
          email: string
          role: string
          invited_by?: string | null
          token?: string
          expires_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          salon_id?: string
          email?: string
          role?: string
          invited_by?: string | null
          token?: string
          expires_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_invites_salon_id_fkey"
            columns: ["salon_id"]
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_invites_invited_by_fkey"
            columns: ["invited_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          salon_id: string
          name: string
          description: string | null
          price: number
          image_urls: string[]
          stock_quantity: number
          is_active: boolean
          variants: Json | null
          stock_threshold: number | null
          sales_count: number
          created_at: string
        }
        Insert: {
          id?: string
          salon_id: string
          name: string
          description?: string | null
          price: number
          image_urls?: string[]
          stock_quantity?: number
          is_active?: boolean
          variants?: Json | null
          stock_threshold?: number | null
          sales_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          salon_id?: string
          name?: string
          description?: string | null
          price?: number
          image_urls?: string[]
          stock_quantity?: number
          is_active?: boolean
          variants?: Json | null
          stock_threshold?: number | null
          sales_count?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_salon_id_fkey"
            columns: ["salon_id"]
            referencedRelation: "salons"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          salon_id: string
          client_id: string | null
          customer_name: string | null
          customer_email: string | null
          customer_phone: string | null
          customer_address: string | null
          total: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          salon_id: string
          client_id?: string | null
          customer_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          customer_address?: string | null
          total: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          salon_id?: string
          client_id?: string | null
          customer_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          customer_address?: string | null
          total?: number
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_salon_id_fkey"
            columns: ["salon_id"]
            referencedRelation: "salons"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          id: string
          salon_id: string
          order_id: string
          product_id: string | null
          quantity: number
          price: number
        }
        Insert: {
          id?: string
          salon_id: string
          order_id: string
          product_id?: string | null
          quantity: number
          price: number
        }
        Update: {
          id?: string
          salon_id?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_salon_id_fkey"
            columns: ["salon_id"]
            referencedRelation: "salons"
            referencedColumns: ["id"]
          }
        ]
      }
      services: {
        Row: {
          id: string
          salon_id: string
          name: string
          duration_minutes: number | null
          price: number | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          salon_id: string
          name: string
          duration_minutes?: number | null
          price?: number | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          salon_id?: string
          name?: string
          duration_minutes?: number | null
          price?: number | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_salon_id_fkey"
            columns: ["salon_id"]
            referencedRelation: "salons"
            referencedColumns: ["id"]
          }
        ]
      }
      appointments: {
        Row: {
          id: string
          salon_id: string
          client_id: string | null
          service_id: string | null
          staff_id: string | null
          start_time: string | null
          end_time: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          salon_id: string
          client_id?: string | null
          service_id?: string | null
          staff_id?: string | null
          start_time?: string | null
          end_time?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          salon_id?: string
          client_id?: string | null
          service_id?: string | null
          staff_id?: string | null
          start_time?: string | null
          end_time?: string | null
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_salon_id_fkey"
            columns: ["salon_id"]
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_staff_id_fkey"
            columns: ["staff_id"]
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: string
          salon_id: string
          order_id: string | null
          amount: number
          method: string | null
          status: string
          transaction_id: string | null
          processed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          salon_id: string
          order_id?: string | null
          amount: number
          method?: string | null
          status?: string
          transaction_id?: string | null
          processed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          salon_id?: string
          order_id?: string | null
          amount?: number
          method?: string | null
          status?: string
          transaction_id?: string | null
          processed_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_salon_id_fkey"
            columns: ["salon_id"]
            referencedRelation: "salons"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          id: string
          salon_id: string
          amount: number
          type: string
          status: string | null
          payment_method: string | null
          reference: string | null
          created_at: string
        }
        Insert: {
          id?: string
          salon_id: string
          amount: number
          type: string
          status?: string | null
          payment_method?: string | null
          reference?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          salon_id?: string
          amount?: number
          type?: string
          status?: string | null
          payment_method?: string | null
          reference?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_salon_id_fkey"
            columns: ["salon_id"]
            referencedRelation: "salons"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_logs: {
        Row: {
          id: number
          salon_id: string
          user_id: string | null
          agent_name: string | null
          role: string
          message: string | null
          created_at: string
        }
        Insert: {
          id?: number
          salon_id: string
          user_id?: string | null
          agent_name?: string | null
          role: string
          message?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          salon_id?: string
          user_id?: string | null
          agent_name?: string | null
          role?: string
          message?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_logs_salon_id_fkey"
            columns: ["salon_id"]
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      reminder_queue: {
        Row: {
          id: number
          salon_id: string
          appointment_id: string | null
          send_at: string
          message: string | null
          phone: string | null
          sent: boolean
          sent_at: string | null
        }
        Insert: {
          id?: number
          salon_id: string
          appointment_id?: string | null
          send_at: string
          message?: string | null
          phone?: string | null
          sent?: boolean
          sent_at?: string | null
        }
        Update: {
          id?: number
          salon_id?: string
          appointment_id?: string | null
          send_at?: string
          message?: string | null
          phone?: string | null
          sent?: boolean
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reminder_queue_appointment_id_fkey"
            columns: ["appointment_id"]
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminder_queue_salon_id_fkey"
            columns: ["salon_id"]
            referencedRelation: "salons"
            referencedColumns: ["id"]
          }
        ]
      }
      audit_logs: {
        Row: {
          id: number
          user_id: string | null
          salon_id: string | null
          action: string | null
          path: string | null
          status: number | null
          user_agent: string | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id?: string | null
          salon_id?: string | null
          action?: string | null
          path?: string | null
          status?: number | null
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string | null
          salon_id?: string | null
          action?: string | null
          path?: string | null
          status?: number | null
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          id: string
          salon_id: string
          key: string
          expires_at: string | null
          revoked: boolean
          created_at: string
        }
        Insert: {
          id?: string
          salon_id: string
          key: string
          expires_at?: string | null
          revoked?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          salon_id?: string
          key?: string
          expires_at?: string | null
          revoked?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_salon_id_fkey"
            columns: ["salon_id"]
            referencedRelation: "salons"
            referencedColumns: ["id"]
          }
        ]
      }
      system_backups: {
        Row: {
          id: string
          type: string | null
          size: number | null
          url: string | null
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          type?: string | null
          size?: number | null
          url?: string | null
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          type?: string | null
          size?: number | null
          url?: string | null
          status?: string | null
          created_at?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          ip: string
          count: number
          last_request: string | null
        }
        Insert: {
          ip: string
          count: number
          last_request?: string | null
        }
        Update: {
          ip?: string
          count?: number
          last_request?: string | null
        }
        Relationships: []
      }
      security_logs: {
        Row: {
          id: number
          type: string | null
          ip: string | null
          details: string | null
          created_at: string
        }
        Insert: {
          id?: number
          type?: string | null
          ip?: string | null
          details?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          type?: string | null
          ip?: string | null
          details?: string | null
          created_at?: string
        }
        Relationships: []
      }
      tenant_components: {
        Row: {
          id: string
          tenant_id: string
          comp_type: string
          comp_name: string | null
          html_chunk: string | null
          css: string | null
          version: number
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          comp_type: string
          comp_name?: string | null
          html_chunk?: string | null
          css?: string | null
          version?: number
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          comp_type?: string
          comp_name?: string | null
          html_chunk?: string | null
          css?: string | null
          version?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_components_tenant_id_fkey"
            columns: ["tenant_id"]
            referencedRelation: "salons"
            referencedColumns: ["id"]
          }
        ]
      }
      design_tokens: {
        Row: {
          created_at: string
          id: string
          tenant_id: string
          tokens: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          tenant_id: string
          tokens: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          tenant_id?: string
          tokens?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_tokens_tenant_id_fkey"
            columns: ["tenant_id"]
            referencedRelation: "salons"
            referencedColumns: ["id"]
          }
        ]
      }
      webhook_logs: {
        Row: {
          id: string
          event: string
          payload: Json
          status: string
          tenant_id: string | null
          error: string | null
          processed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event: string
          payload: Json
          status: string
          tenant_id?: string | null
          error?: string | null
          processed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event?: string
          payload?: Json
          status?: string
          tenant_id?: string | null
          error?: string | null
          processed_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      agent_triggers: {
        Row: {
          id: string
          type: string
          tenant_id: string
          data: Json
          booking_reference: string | null
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          tenant_id: string
          data: Json
          booking_reference?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          tenant_id?: string
          data?: Json
          booking_reference?: string | null
          created_at?: string
        }
        Relationships: []
      }
      availability_slots: {
        Row: {
          id: string
          tenant_id: string
          staff_id: string | null
          start_time: string
          end_time: string
          status: string
          booking_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          staff_id?: string | null
          start_time: string
          end_time: string
          status: string
          booking_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          staff_id?: string | null
          start_time?: string
          end_time?: string
          status?: string
          booking_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          tenant_id: string
          client_id: string | null
          service_id: string | null
          start_time: string
          end_time: string
          status: string
          payment_status: string | null
          payment_id: string | null
          payment_amount: number | null
          payment_error: string | null
          payment_reference: string | null
          updated_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          client_id?: string | null
          service_id?: string | null
          start_time: string
          end_time: string
          status: string
          payment_status?: string | null
          payment_id?: string | null
          payment_amount?: number | null
          payment_error?: string | null
          payment_reference?: string | null
          updated_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          client_id?: string | null
          service_id?: string | null
          start_time?: string
          end_time?: string
          status?: string
          payment_status?: string | null
          payment_id?: string | null
          payment_amount?: number | null
          payment_error?: string | null
          payment_reference?: string | null
          updated_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: {
          p_salon_id: string
          p_user_id: string
        }
        Returns: string
      }
      global_search: {
        Args: {
          search_term: string
          p_salon_id: string
        }
        Returns: {
          id: string
          type: string
          title: string
          subtitle: string
        }[]
      }
      update_appointment_status: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      get_dashboard_stats: {
        Args: {
          salon_id_param: string
        }
        Returns: {
          total_appointments: number
          total_revenue: number
          latest_booking: string | null
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}