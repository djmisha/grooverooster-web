import { SupabaseClient } from "@supabase/supabase-js";

export type Database = {
  public: {
    Tables: {
      artists: {
        Row: {
          id: number;
          name: string;
          slug?: string;
          imageUrl?: string;
          bio?: string;
          mbid?: string;
          url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["artists"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["artists"]["Insert"]>;
      };
      artist_tags: {
        Row: {
          id: number;
          name: string;
          created_at?: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["artist_tags"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["artist_tags"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          username?: string;
          email?: string;
          avatar_url?: string;
          full_name?: string;
          city?: string;
          state?: string;
          updated_at?: string;
          created_at?: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["profiles"]["Row"],
          "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      top_artists: {
        Row: {
          id: number;
          artist_id: number;
          rank?: number;
          created_at?: string;
          updated_at?: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["top_artists"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["top_artists"]["Insert"]>;
      };
    };
  };
};

export type SupabaseClientType = SupabaseClient<Database>;
