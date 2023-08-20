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
      dietary_preferences: {
        Row: {
          code: string | null
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      regions: {
        Row: {
          code: string | null
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
