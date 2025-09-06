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
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          username: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      videos: {
        Row: {
          id: string
          title: string
          description: string | null
          thumbnail_url: string | null
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
          thumbnail_url?: string | null
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
          thumbnail_url?: string | null
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
      comments: {
        Row: {
          id: string
          text: string
          created_at: string
          updated_at: string
          user_id: string
          video_id: string
        }
        Insert: {
          id?: string
          text: string
          created_at?: string
          updated_at?: string
          user_id: string
          video_id: string
        }
        Update: {
          id?: string
          text?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          video_id?: string
        }
      }
      saves: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          video_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          video_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          video_id?: string
        }
      }
      likes: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          video_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          video_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          video_id?: string
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
      tags: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      video_tags: {
        Row: {
          id: string
          created_at: string
          video_id: string
          tag_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          video_id: string
          tag_id: string
        }
        Update: {
          id?: string
          created_at?: string
          video_id?: string
          tag_id?: string
        }
      }
    }
  }
}

