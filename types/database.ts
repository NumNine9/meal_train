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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          actor_phone: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          metadata: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_phone?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_phone?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_slots: {
        Row: {
          claimed_at: string | null
          claimed_by_name: string | null
          claimed_by_phone: string | null
          claimed_by_user_id: string | null
          created_at: string
          date: string
          delivered_at: string | null
          id: string
          meal_train_id: string
          meal_type: Database["public"]["Enums"]["meal_type"]
          slot_type: Database["public"]["Enums"]["slot_type"]
          status: Database["public"]["Enums"]["slot_status"]
          updated_at: string
          volunteer_note: string | null
        }
        Insert: {
          claimed_at?: string | null
          claimed_by_name?: string | null
          claimed_by_phone?: string | null
          claimed_by_user_id?: string | null
          created_at?: string
          date: string
          delivered_at?: string | null
          id?: string
          meal_train_id: string
          meal_type: Database["public"]["Enums"]["meal_type"]
          slot_type?: Database["public"]["Enums"]["slot_type"]
          status?: Database["public"]["Enums"]["slot_status"]
          updated_at?: string
          volunteer_note?: string | null
        }
        Update: {
          claimed_at?: string | null
          claimed_by_name?: string | null
          claimed_by_phone?: string | null
          claimed_by_user_id?: string | null
          created_at?: string
          date?: string
          delivered_at?: string | null
          id?: string
          meal_train_id?: string
          meal_type?: Database["public"]["Enums"]["meal_type"]
          slot_type?: Database["public"]["Enums"]["slot_type"]
          status?: Database["public"]["Enums"]["slot_status"]
          updated_at?: string
          volunteer_note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_slots_claimed_by_user_id_fkey"
            columns: ["claimed_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_slots_meal_train_id_fkey"
            columns: ["meal_train_id"]
            isOneToOne: false
            referencedRelation: "meal_trains"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_trains: {
        Row: {
          created_at: string
          delivery_address: string
          dietary_notes: string | null
          end_date: string
          id: string
          organization_id: string | null
          organizer_id: string
          recipient_name: string
          recipient_note: string | null
          referral_notes: string | null
          referral_source: string | null
          share_token: string
          share_token_expires_at: string | null
          start_date: string
          status: Database["public"]["Enums"]["train_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivery_address: string
          dietary_notes?: string | null
          end_date: string
          id?: string
          organization_id?: string | null
          organizer_id: string
          recipient_name: string
          recipient_note?: string | null
          referral_notes?: string | null
          referral_source?: string | null
          share_token: string
          share_token_expires_at?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["train_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivery_address?: string
          dietary_notes?: string | null
          end_date?: string
          id?: string
          organization_id?: string | null
          organizer_id?: string
          recipient_name?: string
          recipient_note?: string | null
          referral_notes?: string | null
          referral_source?: string | null
          share_token?: string
          share_token_expires_at?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["train_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_trains_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_trains_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          error_message: string | null
          id: string
          meal_slot_id: string | null
          meal_train_id: string | null
          payload: Json | null
          recipient_phone: string
          scheduled_for: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["notification_status"]
          template: string
        }
        Insert: {
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          error_message?: string | null
          id?: string
          meal_slot_id?: string | null
          meal_train_id?: string | null
          payload?: Json | null
          recipient_phone: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          template: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          error_message?: string | null
          id?: string
          meal_slot_id?: string | null
          meal_train_id?: string | null
          payload?: Json | null
          recipient_phone?: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          template?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_meal_slot_id_fkey"
            columns: ["meal_slot_id"]
            isOneToOne: false
            referencedRelation: "meal_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_meal_train_id_fkey"
            columns: ["meal_train_id"]
            isOneToOne: false
            referencedRelation: "meal_trains"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          name: string
          type: Database["public"]["Enums"]["org_type"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name: string
          type?: Database["public"]["Enums"]["org_type"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["org_type"]
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          id: string
          name: string
          organization_id: string | null
          phone: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          organization_id?: string | null
          phone: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          organization_id?: string | null
          phone?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      meal_type: "breakfast" | "lunch" | "dinner"
      notification_channel: "whatsapp" | "sms" | "email" | "push"
      notification_status: "pending" | "sent" | "failed"
      org_type:
        | "individual"
        | "church"
        | "ngo"
        | "school"
        | "hospital"
        | "clinic"
        | "hospice"
      slot_status: "open" | "claimed" | "delivered" | "cancelled"
      slot_type: "meal" | "transport" | "companionship" | "errand" | "custom"
      train_status: "active" | "completed" | "cancelled"
      user_role: "organizer" | "volunteer" | "referrer" | "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      meal_type: ["breakfast", "lunch", "dinner"],
      notification_channel: ["whatsapp", "sms", "email", "push"],
      notification_status: ["pending", "sent", "failed"],
      org_type: [
        "individual",
        "church",
        "ngo",
        "school",
        "hospital",
        "clinic",
        "hospice",
      ],
      slot_status: ["open", "claimed", "delivered", "cancelled"],
      slot_type: ["meal", "transport", "companionship", "errand", "custom"],
      train_status: ["active", "completed", "cancelled"],
      user_role: ["organizer", "volunteer", "referrer", "admin"],
    },
  },
} as const
