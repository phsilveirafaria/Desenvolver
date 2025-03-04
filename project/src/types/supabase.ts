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
      rooms: {
        Row: {
          id: string
          name: string
          capacity: number
          description: string
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          capacity: number
          description: string
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          capacity?: number
          description?: string
          image_url?: string
          created_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          room_id: string
          user_id: string
          user_name: string
          start_time: string
          end_time: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          notes?: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          user_name: string
          start_time: string
          end_time: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          notes?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          user_name?: string
          start_time?: string
          end_time?: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          notes?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          is_admin?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}