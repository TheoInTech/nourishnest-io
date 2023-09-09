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
          code: string
          created_at: string
          id: number
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      frequency_of_meals: {
        Row: {
          code: string
          created_at: string
          id: number
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          billing_reason: string | null
          card_brand: string | null
          card_last_four: string | null
          created_at: string | null
          currency: string | null
          currency_rate: string | null
          discount_total: number | null
          discount_total_formatted: string | null
          discount_total_usd: number | null
          id: number
          refunded: boolean | null
          refunded_at: string | null
          status: string | null
          status_formatted: string | null
          store_id: number
          subscription_id: number
          subtotal: number | null
          subtotal_formatted: string | null
          subtotal_usd: number | null
          tax: number | null
          tax_formatted: string | null
          tax_usd: number | null
          test_mode: boolean | null
          total: number | null
          total_formatted: string | null
          total_usd: number | null
          updated_at: string | null
          urls: Json | null
        }
        Insert: {
          billing_reason?: string | null
          card_brand?: string | null
          card_last_four?: string | null
          created_at?: string | null
          currency?: string | null
          currency_rate?: string | null
          discount_total?: number | null
          discount_total_formatted?: string | null
          discount_total_usd?: number | null
          id?: number
          refunded?: boolean | null
          refunded_at?: string | null
          status?: string | null
          status_formatted?: string | null
          store_id: number
          subscription_id: number
          subtotal?: number | null
          subtotal_formatted?: string | null
          subtotal_usd?: number | null
          tax?: number | null
          tax_formatted?: string | null
          tax_usd?: number | null
          test_mode?: boolean | null
          total?: number | null
          total_formatted?: string | null
          total_usd?: number | null
          updated_at?: string | null
          urls?: Json | null
        }
        Update: {
          billing_reason?: string | null
          card_brand?: string | null
          card_last_four?: string | null
          created_at?: string | null
          currency?: string | null
          currency_rate?: string | null
          discount_total?: number | null
          discount_total_formatted?: string | null
          discount_total_usd?: number | null
          id?: number
          refunded?: boolean | null
          refunded_at?: string | null
          status?: string | null
          status_formatted?: string | null
          store_id?: number
          subscription_id?: number
          subtotal?: number | null
          subtotal_formatted?: string | null
          subtotal_usd?: number | null
          tax?: number | null
          tax_formatted?: string | null
          tax_usd?: number | null
          test_mode?: boolean | null
          total?: number | null
          total_formatted?: string | null
          total_usd?: number | null
          updated_at?: string | null
          urls?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'invoices_subscription_id_fkey'
            columns: ['subscription_id']
            referencedRelation: 'subscriptions'
            referencedColumns: ['id']
          },
        ]
      }
      meal_plans: {
        Row: {
          created_at: string
          id: number
          plan: Json[]
          profile_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          plan: Json[]
          profile_id: number
          updated_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          plan?: Json[]
          profile_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'meal_plans_profile_id_fkey'
            columns: ['profile_id']
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'meal_plans_profile_id_fkey'
            columns: ['profile_id']
            referencedRelation: 'profile_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'meal_plans_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      micronutrients: {
        Row: {
          created_at: string
          description: string
          id: number
          long_name: string
          short_name: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          long_name: string
          short_name: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          long_name?: string
          short_name?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          allergies: string[]
          availed_weeks: number
          avatar_url: string | null
          birthday: string
          created_at: string
          email: string
          generated_weeks: number
          id: number
          nickname: string
          region_id: number
          tags: string[] | null
          updated_at: string
          user_id: string
          weight: number
          weight_type: string
          with_teeth: boolean
        }
        Insert: {
          allergies: string[]
          availed_weeks?: number
          avatar_url?: string | null
          birthday: string
          created_at?: string
          email: string
          generated_weeks?: number
          id?: number
          nickname: string
          region_id: number
          tags?: string[] | null
          updated_at?: string
          user_id: string
          weight: number
          weight_type: string
          with_teeth: boolean
        }
        Update: {
          allergies?: string[]
          availed_weeks?: number
          avatar_url?: string | null
          birthday?: string
          created_at?: string
          email?: string
          generated_weeks?: number
          id?: number
          nickname?: string
          region_id?: number
          tags?: string[] | null
          updated_at?: string
          user_id?: string
          weight?: number
          weight_type?: string
          with_teeth?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'profile_region_id_fkey'
            columns: ['region_id']
            referencedRelation: 'regions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'profile_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      profile_dietary_preferences: {
        Row: {
          created_at: string
          dietary_preferences_id: number
          id: number
          profile_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dietary_preferences_id: number
          id?: number
          profile_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dietary_preferences_id?: number
          id?: number
          profile_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profile_dietary_preferences_dietary_preferences_id_fkey'
            columns: ['dietary_preferences_id']
            referencedRelation: 'dietary_preferences'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'profile_dietary_preferences_profile_id_fkey'
            columns: ['profile_id']
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'profile_dietary_preferences_profile_id_fkey'
            columns: ['profile_id']
            referencedRelation: 'profile_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'profile_dietary_preferences_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      profile_frequency_of_meals: {
        Row: {
          created_at: string
          frequency_of_meals_id: number
          id: number
          profile_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          frequency_of_meals_id: number
          id?: number
          profile_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          frequency_of_meals_id?: number
          id?: number
          profile_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profile_frequency_of_meals_frequency_of_meals_id_fkey'
            columns: ['frequency_of_meals_id']
            referencedRelation: 'frequency_of_meals'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'profile_frequency_of_meals_profile_id_fkey'
            columns: ['profile_id']
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'profile_frequency_of_meals_profile_id_fkey'
            columns: ['profile_id']
            referencedRelation: 'profile_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'profile_frequency_of_meals_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      regions: {
        Row: {
          code: string
          created_at: string
          id: number
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      shopping_plans: {
        Row: {
          created_at: string
          id: number
          plan: Json[]
          profile_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          plan: Json[]
          profile_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          plan?: Json[]
          profile_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'shopping_plans_profile_id_fkey'
            columns: ['profile_id']
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'shopping_plans_profile_id_fkey'
            columns: ['profile_id']
            referencedRelation: 'profile_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'shopping_plans_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      subscriptions: {
        Row: {
          billing_anchor: number | null
          cancelled: boolean | null
          card_brand: string | null
          card_last_four: string | null
          created_at: string
          customer_id: number | null
          ends_at: string | null
          id: number
          order_id: number | null
          order_item_id: number | null
          pause: Json | null
          product_id: number | null
          product_name: string | null
          profile_id: number
          renews_at: string | null
          status: string | null
          status_formatted: string | null
          store_id: number | null
          test_mode: boolean | null
          trial_ends_at: string | null
          updated_at: string | null
          urls: Json | null
          user_email: string | null
          user_id: string
          user_name: string | null
          variant_id: number | null
          variant_name: string | null
        }
        Insert: {
          billing_anchor?: number | null
          cancelled?: boolean | null
          card_brand?: string | null
          card_last_four?: string | null
          created_at?: string
          customer_id?: number | null
          ends_at?: string | null
          id?: number
          order_id?: number | null
          order_item_id?: number | null
          pause?: Json | null
          product_id?: number | null
          product_name?: string | null
          profile_id: number
          renews_at?: string | null
          status?: string | null
          status_formatted?: string | null
          store_id?: number | null
          test_mode?: boolean | null
          trial_ends_at?: string | null
          updated_at?: string | null
          urls?: Json | null
          user_email?: string | null
          user_id: string
          user_name?: string | null
          variant_id?: number | null
          variant_name?: string | null
        }
        Update: {
          billing_anchor?: number | null
          cancelled?: boolean | null
          card_brand?: string | null
          card_last_four?: string | null
          created_at?: string
          customer_id?: number | null
          ends_at?: string | null
          id?: number
          order_id?: number | null
          order_item_id?: number | null
          pause?: Json | null
          product_id?: number | null
          product_name?: string | null
          profile_id?: number
          renews_at?: string | null
          status?: string | null
          status_formatted?: string | null
          store_id?: number | null
          test_mode?: boolean | null
          trial_ends_at?: string | null
          updated_at?: string | null
          urls?: Json | null
          user_email?: string | null
          user_id?: string
          user_name?: string | null
          variant_id?: number | null
          variant_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'subscriptions_profile_id_fkey'
            columns: ['profile_id']
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'subscriptions_profile_id_fkey'
            columns: ['profile_id']
            referencedRelation: 'profile_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'subscriptions_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      tips_of_the_day: {
        Row: {
          created_at: string
          id: number
          tip: string
        }
        Insert: {
          created_at?: string
          id?: number
          tip: string
        }
        Update: {
          created_at?: string
          id?: number
          tip?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          child_birthday: string | null
          created_at: string
          email: string
          id: number
          name: string
        }
        Insert: {
          child_birthday?: string | null
          created_at?: string
          email: string
          id?: number
          name: string
        }
        Update: {
          child_birthday?: string | null
          created_at?: string
          email?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      profile_view: {
        Row: {
          allergies: string[] | null
          availed_weeks: number | null
          avatar_url: string | null
          birthday: string | null
          created_at: string | null
          dietary_preferences: Json | null
          email: string | null
          frequency_of_meals: Json | null
          generated_weeks: number | null
          id: number | null
          invoices: Json | null
          meal_plans: Json | null
          nickname: string | null
          region: Json | null
          region_id: number | null
          shopping_plans: Json | null
          subscriptions: Json | null
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
          weight: number | null
          weight_type: string | null
          with_teeth: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: 'profile_region_id_fkey'
            columns: ['region_id']
            referencedRelation: 'regions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'profile_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
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
