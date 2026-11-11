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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      amenities: {
        Row: {
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      hostel_amenities: {
        Row: {
          amenity_id: string
          hostel_id: string
        }
        Insert: {
          amenity_id: string
          hostel_id: string
        }
        Update: {
          amenity_id?: string
          hostel_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_amenities_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_amenities_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_images: {
        Row: {
          alt: string
          created_at: string
          hostel_id: string
          id: string
          sort_order: number
          url: string
        }
        Insert: {
          alt?: string
          created_at?: string
          hostel_id: string
          id?: string
          sort_order?: number
          url: string
        }
        Update: {
          alt?: string
          created_at?: string
          hostel_id?: string
          id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_images_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_images_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_interests: {
        Row: {
          created_at: string
          hostel_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hostel_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hostel_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_interests_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_interests_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      hostels: {
        Row: {
          address: string
          area: string
          campus: string
          contact_hours: string
          contact_name: string | null
          created_at: string
          description: string
          distance_minutes: number
          featured: boolean
          gender: Database["public"]["Enums"]["gender_preference"]
          id: string
          landmark: string | null
          latitude: number | null
          longitude: number | null
          name: string
          phone: string
          published: boolean
          slug: string
          tagline: string | null
          updated_at: string
          utilities_note: string
          verified: boolean
          whatsapp: string | null
        }
        Insert: {
          address?: string
          area: string
          campus?: string
          contact_hours?: string
          contact_name?: string | null
          created_at?: string
          description?: string
          distance_minutes?: number
          featured?: boolean
          gender?: Database["public"]["Enums"]["gender_preference"]
          id?: string
          landmark?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string
          published?: boolean
          slug: string
          tagline?: string | null
          updated_at?: string
          utilities_note?: string
          verified?: boolean
          whatsapp?: string | null
        }
        Update: {
          address?: string
          area?: string
          campus?: string
          contact_hours?: string
          contact_name?: string | null
          created_at?: string
          description?: string
          distance_minutes?: number
          featured?: boolean
          gender?: Database["public"]["Enums"]["gender_preference"]
          id?: string
          landmark?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string
          published?: boolean
          slug?: string
          tagline?: string | null
          updated_at?: string
          utilities_note?: string
          verified?: boolean
          whatsapp?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      room_types: {
        Row: {
          available_beds: number
          capacity: number
          description: string | null
          hostel_id: string
          id: string
          name: string
          price_per_semester: number
          sort_order: number
          utility_fee: number
        }
        Insert: {
          available_beds?: number
          capacity?: number
          description?: string | null
          hostel_id: string
          id?: string
          name: string
          price_per_semester: number
          sort_order?: number
          utility_fee?: number
        }
        Update: {
          available_beds?: number
          capacity?: number
          description?: string | null
          hostel_id?: string
          id?: string
          name?: string
          price_per_semester?: number
          sort_order?: number
          utility_fee?: number
        }
        Relationships: [
          {
            foreignKeyName: "room_types_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_types_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      hostel_cards: {
        Row: {
          area: string | null
          beds_available: number | null
          campus: string | null
          cheapest_room: string | null
          cover_url: string | null
          created_at: string | null
          distance_minutes: number | null
          featured: boolean | null
          gender: Database["public"]["Enums"]["gender_preference"] | null
          id: string | null
          image_count: number | null
          landmark: string | null
          name: string | null
          phone: string | null
          price_from: number | null
          slug: string | null
          tagline: string | null
          utilities_from: number | null
          verified: boolean | null
        }
        Insert: {
          area?: string | null
          beds_available?: never
          campus?: string | null
          cheapest_room?: never
          cover_url?: never
          created_at?: string | null
          distance_minutes?: number | null
          featured?: boolean | null
          gender?: Database["public"]["Enums"]["gender_preference"] | null
          id?: string | null
          image_count?: never
          landmark?: string | null
          name?: string | null
          phone?: string | null
          price_from?: never
          slug?: string | null
          tagline?: string | null
          utilities_from?: never
          verified?: boolean | null
        }
        Update: {
          area?: string | null
          beds_available?: never
          campus?: string | null
          cheapest_room?: never
          cover_url?: never
          created_at?: string | null
          distance_minutes?: number | null
          featured?: boolean | null
          gender?: Database["public"]["Enums"]["gender_preference"] | null
          id?: string | null
          image_count?: never
          landmark?: string | null
          name?: string | null
          phone?: string | null
          price_from?: never
          slug?: string | null
          tagline?: string | null
          utilities_from?: never
          verified?: boolean | null
        }
        Relationships: []
      }
      hostel_interest_counts: {
        Row: {
          hostel_id: string | null
          interest_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "hostel_interests_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_interests_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      booking_status:
        | "pending"
        | "confirmed"
        | "rejected"
        | "cancelled"
        | "completed"
      gender_preference: "mixed" | "female" | "male"
      payment_method: "momo" | "bank" | "cash"
      payment_status: "pending" | "paid" | "refunded"
      review_status: "pending" | "published" | "hidden"
      user_role: "student" | "admin"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      booking_status: [
        "pending",
        "confirmed",
        "rejected",
        "cancelled",
        "completed",
      ],
      gender_preference: ["mixed", "female", "male"],
      payment_method: ["momo", "bank", "cash"],
      payment_status: ["pending", "paid", "refunded"],
      review_status: ["pending", "published", "hidden"],
      user_role: ["student", "admin"],
    },
  },
} as const
