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
      community_records: {
        Row: {
          audience: string
          category: string
          created_at: string
          created_by: string
          description: string
          id: string
          location: string
          name: string
          platform: string
          status: string
          tags: Json
          updated_at: string
          url: string
        }
        Insert: {
          audience?: string
          category: string
          created_at?: string
          created_by: string
          description: string
          id?: string
          location?: string
          name: string
          platform: string
          status?: string
          tags?: Json
          updated_at?: string
          url?: string
        }
        Update: {
          audience?: string
          category?: string
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          location?: string
          name?: string
          platform?: string
          status?: string
          tags?: Json
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      event_contacts: {
        Row: {
          contact_email: string
          event_id: string
        }
        Insert: {
          contact_email: string
          event_id: string
        }
        Update: {
          contact_email?: string
          event_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_contacts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "event_records"
            referencedColumns: ["id"]
          },
        ]
      }
      event_records: {
        Row: {
          created_at: string
          duplicate_matches: Json
          event: Json
          id: string
          review_reason: string
          reviewed_at: string | null
          reviewer_id: string | null
          status: string
          submitter_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          duplicate_matches?: Json
          event: Json
          id?: string
          review_reason?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          submitter_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          duplicate_matches?: Json
          event?: Json
          id?: string
          review_reason?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          submitter_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_review_history: {
        Row: {
          action: string
          created_at: string
          event_id: string | null
          id: string
          reason: string
          reviewer_id: string
        }
        Insert: {
          action: string
          created_at?: string
          event_id?: string | null
          id?: string
          reason?: string
          reviewer_id: string
        }
        Update: {
          action?: string
          created_at?: string
          event_id?: string | null
          id?: string
          reason?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_review_history_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_records"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          display_name: string
          id: string
        }
        Insert: {
          display_name?: string
          id: string
        }
        Update: {
          display_name?: string
          id?: string
        }
        Relationships: []
      }
      published_event_urls: {
        Row: {
          event_id: string | null
          url: string
        }
        Insert: {
          event_id?: string | null
          url: string
        }
        Update: {
          event_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "published_event_urls_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_records"
            referencedColumns: ["id"]
          },
        ]
      }
      user_marks: {
        Row: {
          item_id: string
          kind: string
          user_id: string
        }
        Insert: {
          item_id: string
          kind: string
          user_id: string
        }
        Update: {
          item_id?: string
          kind?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_marks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          categories: string[]
          date_from: string
          date_until: string
          formats: string[]
          interests: string[]
          internship_roles: string[]
          location: string
          user_id: string
          work_formats: string[]
        }
        Insert: {
          categories?: string[]
          date_from?: string
          date_until?: string
          formats?: string[]
          interests?: string[]
          internship_roles?: string[]
          location?: string
          user_id: string
          work_formats?: string[]
        }
        Update: {
          categories?: string[]
          date_from?: string
          date_until?: string
          formats?: string[]
          interests?: string[]
          internship_roles?: string[]
          location?: string
          user_id?: string
          work_formats?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_event_duplicates: { Args: { candidate: Json }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      moderate_event: {
        Args: { action: string; reason?: string; record_id: string }
        Returns: undefined
      }
      normalize_event_text: { Args: { v: string }; Returns: string }
      normalize_event_url: { Args: { v: string }; Returns: string }
      submit_event: {
        Args: { acknowledged?: boolean; candidate: Json; contact: string }
        Returns: Json
      }
      update_event_registration: {
        Args: {
          record_id: string
          registration_deadline?: string
          registration_url: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
