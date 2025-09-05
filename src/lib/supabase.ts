import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 型定義
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          title: string
          description: string | null
          thumbnail: string | null
          video_url: string
          duration: number | null
          view_count: number
          like_count: number
          is_published: boolean
          created_at: string
          updated_at: string
          user_id: string
          category_id: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          thumbnail?: string | null
          video_url: string
          duration?: number | null
          view_count?: number
          like_count?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
          user_id: string
          category_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          thumbnail?: string | null
          video_url?: string
          duration?: number | null
          view_count?: number
          like_count?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string
          category_id?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

