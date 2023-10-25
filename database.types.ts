export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      Account: {
        Row: {
          access_token: string | null;
          expires_at: number | null;
          id: string;
          id_token: string | null;
          oauth_token: string | null;
          oauth_token_secret: string | null;
          provider: string;
          providerAccountId: string;
          refresh_token: string | null;
          scope: string | null;
          session_state: string | null;
          token_type: string | null;
          type: string;
          user_id: string;
        };
        Insert: {
          access_token?: string | null;
          expires_at?: number | null;
          id: string;
          id_token?: string | null;
          oauth_token?: string | null;
          oauth_token_secret?: string | null;
          provider: string;
          providerAccountId: string;
          refresh_token?: string | null;
          scope?: string | null;
          session_state?: string | null;
          token_type?: string | null;
          type: string;
          user_id: string;
        };
        Update: {
          access_token?: string | null;
          expires_at?: number | null;
          id?: string;
          id_token?: string | null;
          oauth_token?: string | null;
          oauth_token_secret?: string | null;
          provider?: string;
          providerAccountId?: string;
          refresh_token?: string | null;
          scope?: string | null;
          session_state?: string | null;
          token_type?: string | null;
          type?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      Activity: {
        Row: {
          created_at: string;
          id: string;
          referenceId: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          referenceId: string;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          referenceId?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      Album: {
        Row: {
          artist: string;
          averageRating: number;
          id: string;
          lastUpdated: string;
          name: string;
          notes: string | null;
          releaseDate: string;
        };
        Insert: {
          artist: string;
          averageRating?: number;
          id: string;
          lastUpdated?: string;
          name: string;
          notes?: string | null;
          releaseDate: string;
        };
        Update: {
          artist?: string;
          averageRating?: number;
          id?: string;
          lastUpdated?: string;
          name?: string;
          notes?: string | null;
          releaseDate?: string;
        };
        Relationships: [];
      };
      Caption: {
        Row: {
          id: string;
          link: string | null;
          media: string | null;
          text: string | null;
        };
        Insert: {
          id: string;
          link?: string | null;
          media?: string | null;
          text?: string | null;
        };
        Update: {
          id?: string;
          link?: string | null;
          media?: string | null;
          text?: string | null;
        };
        Relationships: [];
      };
      Entry: {
        Row: {
          id: string;
          rating: number;
          text: string;
        };
        Insert: {
          id: string;
          rating: number;
          text: string;
        };
        Update: {
          id?: string;
          rating?: number;
          text?: string;
        };
        Relationships: [];
      };
      Favorite: {
        Row: {
          albumId: string;
          createdAt: string;
          id: string;
          updatedAt: string;
          userId: string;
        };
        Insert: {
          albumId: string;
          createdAt?: string;
          id: string;
          updatedAt: string;
          userId: string;
        };
        Update: {
          albumId?: string;
          createdAt?: string;
          id?: string;
          updatedAt?: string;
          userId?: string;
        };
        Relationships: [];
      };
      Follows: {
        Row: {
          followerId: string;
          followingId: string;
          id: string;
        };
        Insert: {
          followerId: string;
          followingId: string;
          id: string;
        };
        Update: {
          followerId?: string;
          followingId?: string;
          id?: string;
        };
        Relationships: [];
      };
      Heart: {
        Row: {
          authorId: string;
          created_at: string;
          id: string;
          recordId: string | null;
          replyId: string | null;
          updated_at: string;
        };
        Insert: {
          authorId: string;
          created_at?: string;
          id: string;
          recordId?: string | null;
          replyId?: string | null;
          updated_at: string;
        };
        Update: {
          authorId?: string;
          created_at?: string;
          id?: string;
          recordId?: string | null;
          replyId?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      Notification: {
        Row: {
          activityId: string;
          id: string;
          read: boolean;
          recipientId: string;
        };
        Insert: {
          activityId: string;
          id: string;
          read?: boolean;
          recipientId: string;
        };
        Update: {
          activityId?: string;
          id?: string;
          read?: boolean;
          recipientId?: string;
        };
        Relationships: [];
      };
      Record: {
        Row: {
          albumId: string | null;
          authorId: string;
          captionId: string | null;
          createdAt: string;
          entryId: string | null;
          id: string;
          trackId: string | null;
          type: Database["public"]["Enums"]["RecordType"];
          updatedAt: string;
        };
        Insert: {
          albumId?: string | null;
          authorId: string;
          captionId?: string | null;
          createdAt?: string;
          entryId?: string | null;
          id: string;
          trackId?: string | null;
          type: Database["public"]["Enums"]["RecordType"];
          updatedAt: string;
        };
        Update: {
          albumId?: string | null;
          authorId?: string;
          captionId?: string | null;
          createdAt?: string;
          entryId?: string | null;
          id?: string;
          trackId?: string | null;
          type?: Database["public"]["Enums"]["RecordType"];
          updatedAt?: string;
        };
        Relationships: [];
      };
      Reply: {
        Row: {
          authorId: string;
          content: string;
          created_at: string;
          deleted_at: string | null;
          id: string;
          recordId: string;
          replyToId: string | null;
          rootReplyId: string | null;
          updated_at: string;
        };
        Insert: {
          authorId: string;
          content: string;
          created_at?: string;
          deleted_at?: string | null;
          id: string;
          recordId: string;
          replyToId?: string | null;
          rootReplyId?: string | null;
          updated_at: string;
        };
        Update: {
          authorId?: string;
          content?: string;
          created_at?: string;
          deleted_at?: string | null;
          id?: string;
          recordId?: string;
          replyToId?: string | null;
          rootReplyId?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      Session: {
        Row: {
          expires: string;
          id: string;
          sessionToken: string;
          userId: string;
        };
        Insert: {
          expires: string;
          id: string;
          sessionToken: string;
          userId: string;
        };
        Update: {
          expires?: string;
          id?: string;
          sessionToken?: string;
          userId?: string;
        };
        Relationships: [];
      };
      Track: {
        Row: {
          albumId: string;
          id: string;
          name: string;
        };
        Insert: {
          albumId: string;
          id: string;
          name: string;
        };
        Update: {
          albumId?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      User: {
        Row: {
          bio: string | null;
          date_joined: string;
          date_updated: string;
          email: string;
          emailVerified: string | null;
          id: string;
          image: string | null;
          name: string;
          password: string | null;
          username: string | null;
        };
        Insert: {
          bio?: string | null;
          date_joined?: string;
          date_updated: string;
          email: string;
          emailVerified?: string | null;
          id: string;
          image?: string | null;
          name: string;
          password?: string | null;
          username?: string | null;
        };
        Update: {
          bio?: string | null;
          date_joined?: string;
          date_updated?: string;
          email?: string;
          emailVerified?: string | null;
          id?: string;
          image?: string | null;
          name?: string;
          password?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      VerificationToken: {
        Row: {
          expires: string;
          id: number;
          identifier: string;
          token: string;
        };
        Insert: {
          expires: string;
          id?: number;
          identifier: string;
          token: string;
        };
        Update: {
          expires?: string;
          id?: number;
          identifier?: string;
          token?: string;
        };
        Relationships: [];
      };
      View: {
        Row: {
          id: string;
          referenceId: string;
          userId: string;
          viewedAt: string;
          viewType: Database["public"]["Enums"]["ViewType"];
        };
        Insert: {
          id: string;
          referenceId: string;
          userId: string;
          viewedAt?: string;
          viewType: Database["public"]["Enums"]["ViewType"];
        };
        Update: {
          id?: string;
          referenceId?: string;
          userId?: string;
          viewedAt?: string;
          viewType?: Database["public"]["Enums"]["ViewType"];
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
      ActivityType: "RECORD" | "LIKE" | "FOLLOW" | "REPLY";
      RecordType: "ENTRY" | "CAPTION";
      ViewType: "RECORD" | "REPLY" | "ALBUM";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
