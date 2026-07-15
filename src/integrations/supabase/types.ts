export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_bookings: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          end_date: string
          guest_contact: string | null
          guest_name: string | null
          id: string
          location: string | null
          notes: string | null
          start_date: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          end_date: string
          guest_contact?: string | null
          guest_name?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          start_date: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          end_date?: string
          guest_contact?: string | null
          guest_name?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          start_date?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      b2b_leads: {
        Row: {
          address: string | null
          category: string | null
          created_at: string
          created_by: string | null
          emails: string[]
          id: string
          last_contacted_at: string | null
          lat: number | null
          lng: number | null
          name: string
          notes: string | null
          phone: string | null
          place_id: string | null
          rating: number | null
          search_query: string | null
          status: string
          tags: string[]
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          emails?: string[]
          id?: string
          last_contacted_at?: string | null
          lat?: number | null
          lng?: number | null
          name: string
          notes?: string | null
          phone?: string | null
          place_id?: string | null
          rating?: number | null
          search_query?: string | null
          status?: string
          tags?: string[]
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          emails?: string[]
          id?: string
          last_contacted_at?: string | null
          lat?: number | null
          lng?: number | null
          name?: string
          notes?: string | null
          phone?: string | null
          place_id?: string | null
          rating?: number | null
          search_query?: string | null
          status?: string
          tags?: string[]
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      booking_tasks: {
        Row: {
          admin_booking_id: string | null
          assignee: string | null
          created_at: string
          due_date: string | null
          id: string
          manual_booking_id: string | null
          notes: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          admin_booking_id?: string | null
          assignee?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          manual_booking_id?: string | null
          notes?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          admin_booking_id?: string | null
          assignee?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          manual_booking_id?: string | null
          notes?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_tasks_admin_booking_id_fkey"
            columns: ["admin_booking_id"]
            isOneToOne: false
            referencedRelation: "admin_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_tasks_manual_booking_id_fkey"
            columns: ["manual_booking_id"]
            isOneToOne: false
            referencedRelation: "manual_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          admin_notes: string | null
          booking_date: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          source_page: string | null
          status: Database["public"]["Enums"]["enquiry_status"]
          subject: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          booking_date?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          source_page?: string | null
          status?: Database["public"]["Enums"]["enquiry_status"]
          subject: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          booking_date?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          source_page?: string | null
          status?: Database["public"]["Enums"]["enquiry_status"]
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          created_by: string | null
          currency: string
          date: string
          id: string
          manual_booking_id: string | null
          note: string | null
          receipt_url: string | null
          updated_at: string
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          date?: string
          id?: string
          manual_booking_id?: string | null
          note?: string | null
          receipt_url?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          date?: string
          id?: string
          manual_booking_id?: string | null
          note?: string | null
          receipt_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_manual_booking_id_fkey"
            columns: ["manual_booking_id"]
            isOneToOne: false
            referencedRelation: "manual_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      manual_bookings: {
        Row: {
          balance_due: number
          booking_code: string
          client_email: string | null
          client_name: string
          client_phone: string | null
          confirmation_message: string | null
          created_at: string
          created_by: string | null
          currency: string
          deposit_amount: number
          end_date: string | null
          id: string
          line_items: Json
          notes: string | null
          start_date: string | null
          status: string
          subtotal: number
          updated_at: string
        }
        Insert: {
          balance_due?: number
          booking_code?: string
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          confirmation_message?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          deposit_amount?: number
          end_date?: string | null
          id?: string
          line_items?: Json
          notes?: string | null
          start_date?: string | null
          status?: string
          subtotal?: number
          updated_at?: string
        }
        Update: {
          balance_due?: number
          booking_code?: string
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          confirmation_message?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          deposit_amount?: number
          end_date?: string | null
          id?: string
          line_items?: Json
          notes?: string | null
          start_date?: string | null
          status?: string
          subtotal?: number
          updated_at?: string
        }
        Relationships: []
      }
      rental_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          currency: string
          email: string
          estimated_total: number | null
          extras: string[]
          id: string
          message: string | null
          name: string
          phone: string | null
          pickup_date: string
          pickup_location: string
          return_date: string
          status: Database["public"]["Enums"]["enquiry_status"]
          updated_at: string
          vehicle_name: string
          vehicle_slug: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          currency?: string
          email: string
          estimated_total?: number | null
          extras?: string[]
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          pickup_date: string
          pickup_location: string
          return_date: string
          status?: Database["public"]["Enums"]["enquiry_status"]
          updated_at?: string
          vehicle_name: string
          vehicle_slug: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          currency?: string
          email?: string
          estimated_total?: number | null
          extras?: string[]
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          pickup_date?: string
          pickup_location?: string
          return_date?: string
          status?: Database["public"]["Enums"]["enquiry_status"]
          updated_at?: string
          vehicle_name?: string
          vehicle_slug?: string
        }
        Relationships: []
      }
      supplier_payouts: {
        Row: {
          amount: number
          created_at: string
          currency: string
          due_date: string | null
          id: string
          manual_booking_id: string | null
          note: string | null
          paid_at: string | null
          status: string
          supplier_id: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          manual_booking_id?: string | null
          note?: string | null
          paid_at?: string | null
          status?: string
          supplier_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          manual_booking_id?: string | null
          note?: string | null
          paid_at?: string | null
          status?: string
          supplier_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_payouts_manual_booking_id_fkey"
            columns: ["manual_booking_id"]
            isOneToOne: false
            referencedRelation: "manual_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_payouts_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          category: string
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      suppliers_directory: {
        Row: {
          category: Database["public"]["Enums"]["supplier_category"]
          city: string | null
          company_name: string
          contact_name: string | null
          country: string | null
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          last_contacted_at: string | null
          notes: string | null
          phone: string | null
          preferred: boolean
          rate_notes: string | null
          rating: number | null
          services_offered: string[]
          status: Database["public"]["Enums"]["supplier_status"]
          updated_at: string
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["supplier_category"]
          city?: string | null
          company_name: string
          contact_name?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          last_contacted_at?: string | null
          notes?: string | null
          phone?: string | null
          preferred?: boolean
          rate_notes?: string | null
          rating?: number | null
          services_offered?: string[]
          status?: Database["public"]["Enums"]["supplier_status"]
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["supplier_category"]
          city?: string | null
          company_name?: string
          contact_name?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          last_contacted_at?: string | null
          notes?: string | null
          phone?: string | null
          preferred?: boolean
          rate_notes?: string | null
          rating?: number | null
          services_offered?: string[]
          status?: Database["public"]["Enums"]["supplier_status"]
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_clicks: {
        Row: {
          created_at: string
          id: string
          path: string | null
          referrer: string | null
          source_label: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          path?: string | null
          referrer?: string | null
          source_label?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          path?: string | null
          referrer?: string | null
          source_label?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin"
      enquiry_status: "new" | "in_progress" | "done" | "archived"
      supplier_category:
        | "transport"
        | "accommodation"
        | "tours"
        | "yachts"
        | "aviation"
        | "security"
        | "wellness"
        | "dining"
        | "events"
        | "photography"
        | "staffing"
        | "other"
      supplier_status: "active" | "pending" | "inactive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
      enquiry_status: ["new", "in_progress", "done", "archived"],
      supplier_category: [
        "transport",
        "accommodation",
        "tours",
        "yachts",
        "aviation",
        "security",
        "wellness",
        "dining",
        "events",
        "photography",
        "staffing",
        "other",
      ],
      supplier_status: ["active", "pending", "inactive"],
    },
  },
} as const
