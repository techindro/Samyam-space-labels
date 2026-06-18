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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      annotation_tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string
          dataset_id: string | null
          id: string
          instructions: string | null
          label_schema: Json
          payload: Json
          result: Json | null
          reviewer_id: string | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by: string
          dataset_id?: string | null
          id?: string
          instructions?: string | null
          label_schema?: Json
          payload?: Json
          result?: Json | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string
          dataset_id?: string | null
          id?: string
          instructions?: string | null
          label_schema?: Json
          payload?: Json
          result?: Json | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "annotation_tasks_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
        ]
      }
      datasets: {
        Row: {
          created_at: string
          description: string | null
          domain: string | null
          id: string
          item_count: number
          name: string
          owner_id: string
          status: Database["public"]["Enums"]["dataset_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          domain?: string | null
          id?: string
          item_count?: number
          name: string
          owner_id: string
          status?: Database["public"]["Enums"]["dataset_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          domain?: string | null
          id?: string
          item_count?: number
          name?: string
          owner_id?: string
          status?: Database["public"]["Enums"]["dataset_status"]
          updated_at?: string
        }
        Relationships: []
      }
      demo_requests: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          product_interest: string | null
          role: string | null
          status: Database["public"]["Enums"]["demo_status"]
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          product_interest?: string | null
          role?: string | null
          status?: Database["public"]["Enums"]["demo_status"]
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          product_interest?: string | null
          role?: string | null
          status?: Database["public"]["Enums"]["demo_status"]
        }
        Relationships: []
      }
      evaluation_runs: {
        Row: {
          benchmark: string
          created_at: string
          id: string
          metrics: Json
          model_name: string
          notes: string | null
          owner_id: string
          provider: string | null
          score: number | null
          status: Database["public"]["Enums"]["eval_status"]
          updated_at: string
        }
        Insert: {
          benchmark: string
          created_at?: string
          id?: string
          metrics?: Json
          model_name: string
          notes?: string | null
          owner_id: string
          provider?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["eval_status"]
          updated_at?: string
        }
        Update: {
          benchmark?: string
          created_at?: string
          id?: string
          metrics?: Json
          model_name?: string
          notes?: string | null
          owner_id?: string
          provider?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["eval_status"]
          updated_at?: string
        }
        Relationships: []
      }
      frontier_leaderboards: {
        Row: {
          benchmark: string | null
          category: string | null
          created_at: string
          evaluated_at: string | null
          id: string
          model_name: string
          provider: string | null
          rank: number | null
          score: number | null
        }
        Insert: {
          benchmark?: string | null
          category?: string | null
          created_at?: string
          evaluated_at?: string | null
          id?: string
          model_name: string
          provider?: string | null
          rank?: number | null
          score?: number | null
        }
        Update: {
          benchmark?: string | null
          category?: string | null
          created_at?: string
          evaluated_at?: string | null
          id?: string
          model_name?: string
          provider?: string | null
          rank?: number | null
          score?: number | null
        }
        Relationships: []
      }
      preference_leaderboards: {
        Row: {
          category: string | null
          created_at: string
          elo_score: number | null
          id: string
          losses: number | null
          model_name: string
          provider: string | null
          total_comparisons: number | null
          updated_at: string
          wins: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          elo_score?: number | null
          id?: string
          losses?: number | null
          model_name: string
          provider?: string | null
          total_comparisons?: number | null
          updated_at?: string
          wins?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          elo_score?: number | null
          id?: string
          losses?: number | null
          model_name?: string
          provider?: string | null
          total_comparisons?: number | null
          updated_at?: string
          wins?: number | null
        }
        Relationships: []
      }
      preference_votes: {
        Row: {
          created_at: string
          id: string
          model_a: string
          model_b: string
          prompt: string
          rationale: string | null
          response_a: string | null
          response_b: string | null
          voter_id: string
          winner: string
        }
        Insert: {
          created_at?: string
          id?: string
          model_a: string
          model_b: string
          prompt: string
          rationale?: string | null
          response_a?: string | null
          response_b?: string | null
          voter_id: string
          winner: string
        }
        Update: {
          created_at?: string
          id?: string
          model_a?: string
          model_b?: string
          prompt?: string
          rationale?: string | null
          response_a?: string | null
          response_b?: string | null
          voter_id?: string
          winner?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      research_blog_posts: {
        Row: {
          author: string | null
          content: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      research_careers: {
        Row: {
          apply_url: string | null
          created_at: string
          department: string | null
          description: string | null
          id: string
          is_active: boolean | null
          location: string | null
          requirements: string[] | null
          title: string
          type: string | null
          updated_at: string
        }
        Insert: {
          apply_url?: string | null
          created_at?: string
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          requirements?: string[] | null
          title: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          apply_url?: string | null
          created_at?: string
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          requirements?: string[] | null
          title?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      research_labs: {
        Row: {
          created_at: string
          description: string | null
          focus_area: string | null
          id: string
          image_url: string | null
          lead_researcher: string | null
          name: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          focus_area?: string | null
          id?: string
          image_url?: string | null
          lead_researcher?: string | null
          name: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          focus_area?: string | null
          id?: string
          image_url?: string | null
          lead_researcher?: string | null
          name?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      research_papers: {
        Row: {
          abstract: string | null
          authors: string[] | null
          created_at: string
          id: string
          pdf_url: string | null
          published_date: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          abstract?: string | null
          authors?: string[] | null
          created_at?: string
          id?: string
          pdf_url?: string | null
          published_date?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          abstract?: string | null
          authors?: string[] | null
          created_at?: string
          id?: string
          pdf_url?: string | null
          published_date?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      dataset_status: "draft" | "active" | "archived"
      demo_status: "new" | "contacted" | "qualified" | "closed"
      eval_status: "queued" | "running" | "completed" | "failed"
      task_status:
        | "open"
        | "in_progress"
        | "submitted"
        | "approved"
        | "rejected"
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
      app_role: ["admin", "moderator", "user"],
      dataset_status: ["draft", "active", "archived"],
      demo_status: ["new", "contacted", "qualified", "closed"],
      eval_status: ["queued", "running", "completed", "failed"],
      task_status: ["open", "in_progress", "submitted", "approved", "rejected"],
    },
  },
} as const
