export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      about: {
        Row: {
          content_html: string;
          id: number;
          is_visible: boolean;
          title: string;
        };
        Insert: {
          content_html: string;
          id?: number;
          is_visible?: boolean;
          title: string;
        };
        Update: {
          content_html?: string;
          id?: number;
          is_visible?: boolean;
          title?: string;
        };
        Relationships: [];
      };
      blogs: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          id: string;
          interests: string[] | null;
          is_visible: boolean;
          pseudo: string;
          user_id: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          id?: string;
          interests?: string[] | null;
          is_visible?: boolean;
          pseudo: string;
          user_id: string;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          id?: string;
          interests?: string[] | null;
          is_visible?: boolean;
          pseudo?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blogs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      posts: {
        Row: {
          blog_id: string;
          content_html: string;
          cover_image_url: string | null;
          id: string;
          is_visible: boolean;
          published_at: string | null;
          slug: string;
          title: string;
        };
        Insert: {
          blog_id: string;
          content_html: string;
          cover_image_url?: string | null;
          id?: string;
          is_visible?: boolean;
          published_at?: string | null;
          slug: string;
          title: string;
        };
        Update: {
          blog_id?: string;
          content_html?: string;
          cover_image_url?: string | null;
          id?: string;
          is_visible?: boolean;
          published_at?: string | null;
          slug?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posts_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          email: string;
          id: string;
          is_active: boolean;
          password_hash: string;
          role: "admin" | "blogger";
        };
        Insert: {
          email: string;
          id?: string;
          is_active?: boolean;
          password_hash: string;
          role: "admin" | "blogger";
        };
        Update: {
          email?: string;
          id?: string;
          is_active?: boolean;
          password_hash?: string;
          role?: "admin" | "blogger";
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
