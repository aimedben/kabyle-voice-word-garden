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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          code: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          metric: string
          name: string
          threshold: number
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          metric?: string
          name: string
          threshold?: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          metric?: string
          name?: string
          threshold?: number
        }
        Relationships: []
      }
      dialects: {
        Row: {
          code: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          region_id: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          region_id?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          region_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dialects_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age_group: Database["public"]["Enums"]["age_group"] | null
          avatar_url: string | null
          bio: string | null
          country: string | null
          created_at: string
          dialect_id: string | null
          display_name: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          native_speaker: boolean
          points: number
          region_id: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          age_group?: Database["public"]["Enums"]["age_group"] | null
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          dialect_id?: string | null
          display_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id: string
          native_speaker?: boolean
          points?: number
          region_id?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          age_group?: Database["public"]["Enums"]["age_group"] | null
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          dialect_id?: string | null
          display_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          native_speaker?: boolean
          points?: number
          region_id?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_dialect_fk"
            columns: ["dialect_id"]
            isOneToOne: false
            referencedRelation: "dialects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_region_fk"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_prompts: {
        Row: {
          id: string
          is_active: boolean
          kind: string
          position: number
          source: string
          source_name: string
          text: string
          translation: string
        }
        Insert: {
          id: string
          is_active?: boolean
          kind: string
          position?: number
          source: string
          source_name: string
          text: string
          translation: string
        }
        Update: {
          id?: string
          is_active?: boolean
          kind?: string
          position?: number
          source?: string
          source_name?: string
          text?: string
          translation?: string
        }
        Relationships: []
      }
      recordings: {
        Row: {
          admin_comment: string | null
          age_group: Database["public"]["Enums"]["age_group"] | null
          audio_format: string | null
          created_at: string
          dialect_id: string | null
          duration_seconds: number
          emotion: Database["public"]["Enums"]["emotion_type"]
          file_size_bytes: number
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          language: string
          noise_level: Database["public"]["Enums"]["noise_level"]
          quality_score: number | null
          recorded_at: string
          recording_type: Database["public"]["Enums"]["recording_type"]
          region_id: string | null
          sample_rate: number | null
          sentence_id: string | null
          speaker_id: string
          storage_path: string
          updated_at: string
          validation_status: Database["public"]["Enums"]["validation_status"]
        }
        Insert: {
          admin_comment?: string | null
          age_group?: Database["public"]["Enums"]["age_group"] | null
          audio_format?: string | null
          created_at?: string
          dialect_id?: string | null
          duration_seconds?: number
          emotion?: Database["public"]["Enums"]["emotion_type"]
          file_size_bytes?: number
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          language?: string
          noise_level?: Database["public"]["Enums"]["noise_level"]
          quality_score?: number | null
          recorded_at?: string
          recording_type?: Database["public"]["Enums"]["recording_type"]
          region_id?: string | null
          sample_rate?: number | null
          sentence_id?: string | null
          speaker_id: string
          storage_path: string
          updated_at?: string
          validation_status?: Database["public"]["Enums"]["validation_status"]
        }
        Update: {
          admin_comment?: string | null
          age_group?: Database["public"]["Enums"]["age_group"] | null
          audio_format?: string | null
          created_at?: string
          dialect_id?: string | null
          duration_seconds?: number
          emotion?: Database["public"]["Enums"]["emotion_type"]
          file_size_bytes?: number
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          language?: string
          noise_level?: Database["public"]["Enums"]["noise_level"]
          quality_score?: number | null
          recorded_at?: string
          recording_type?: Database["public"]["Enums"]["recording_type"]
          region_id?: string | null
          sample_rate?: number | null
          sentence_id?: string | null
          speaker_id?: string
          storage_path?: string
          updated_at?: string
          validation_status?: Database["public"]["Enums"]["validation_status"]
        }
        Relationships: [
          {
            foreignKeyName: "recordings_dialect_id_fkey"
            columns: ["dialect_id"]
            isOneToOne: false
            referencedRelation: "dialects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recordings_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recordings_sentence_id_fkey"
            columns: ["sentence_id"]
            isOneToOne: false
            referencedRelation: "sentences"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          code: string | null
          country: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code?: string | null
          country?: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string | null
          country?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      sentences: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          dialect_id: string | null
          difficulty: number
          id: string
          is_active: boolean
          language: string
          recorded_count: number
          source: string | null
          text: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          dialect_id?: string | null
          difficulty?: number
          id?: string
          is_active?: boolean
          language?: string
          recorded_count?: number
          source?: string | null
          text: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          dialect_id?: string | null
          difficulty?: number
          id?: string
          is_active?: boolean
          language?: string
          recorded_count?: number
          source?: string | null
          text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sentences_dialect_id_fkey"
            columns: ["dialect_id"]
            isOneToOne: false
            referencedRelation: "dialects"
            referencedColumns: ["id"]
          },
        ]
      }
      transcriptions: {
        Row: {
          auto_text: string | null
          confidence: number | null
          corrected_at: string | null
          corrected_by: string | null
          corrected_text: string | null
          created_at: string
          id: string
          model: string | null
          recording_id: string
          updated_at: string
        }
        Insert: {
          auto_text?: string | null
          confidence?: number | null
          corrected_at?: string | null
          corrected_by?: string | null
          corrected_text?: string | null
          created_at?: string
          id?: string
          model?: string | null
          recording_id: string
          updated_at?: string
        }
        Update: {
          auto_text?: string | null
          confidence?: number | null
          corrected_at?: string | null
          corrected_by?: string | null
          corrected_text?: string | null
          created_at?: string
          id?: string
          model?: string | null
          recording_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transcriptions_recording_id_fkey"
            columns: ["recording_id"]
            isOneToOne: true
            referencedRelation: "recordings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
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
      validations: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          quality_score: number | null
          recording_id: string
          status: Database["public"]["Enums"]["validation_status"]
          validator_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          quality_score?: number | null
          recording_id: string
          status: Database["public"]["Enums"]["validation_status"]
          validator_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          quality_score?: number | null
          recording_id?: string
          status?: Database["public"]["Enums"]["validation_status"]
          validator_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "validations_recording_id_fkey"
            columns: ["recording_id"]
            isOneToOne: false
            referencedRelation: "recordings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      daily_growth: {
        Args: { _days?: number }
        Returns: {
          day: string
          recordings: number
          seconds: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_reviewer: { Args: { _user_id: string }; Returns: boolean }
      leaderboard: {
        Args: { _limit?: number }
        Returns: {
          avatar_url: string
          display_name: string
          points: number
          recordings: number
          seconds: number
          user_id: string
          username: string
        }[]
      }
      platform_stats: {
        Args: never
        Returns: {
          avg_quality: number
          contributors: number
          pending_recordings: number
          rejected_recordings: number
          total_hours: number
          total_recordings: number
          total_sentences: number
          validated_recordings: number
        }[]
      }
    }
    Enums: {
      age_group: "under_18" | "18_29" | "30_44" | "45_59" | "60_plus"
      app_role: "admin" | "validator" | "contributor"
      emotion_type: "happy" | "sad" | "neutral" | "angry"
      gender_type: "male" | "female" | "other" | "prefer_not_to_say"
      noise_level: "silent" | "street" | "home" | "car" | "office"
      recording_type:
        | "reading"
        | "conversation"
        | "story"
        | "interview"
        | "podcast"
      validation_status: "pending" | "validated" | "rejected"
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
      age_group: ["under_18", "18_29", "30_44", "45_59", "60_plus"],
      app_role: ["admin", "validator", "contributor"],
      emotion_type: ["happy", "sad", "neutral", "angry"],
      gender_type: ["male", "female", "other", "prefer_not_to_say"],
      noise_level: ["silent", "street", "home", "car", "office"],
      recording_type: [
        "reading",
        "conversation",
        "story",
        "interview",
        "podcast",
      ],
      validation_status: ["pending", "validated", "rejected"],
    },
  },
} as const
