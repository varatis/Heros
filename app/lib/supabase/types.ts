export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type StoryGenre =
  | "fantasy"
  | "adventure"
  | "mystery"
  | "scifi"
  | "horror"
  | "romance";

export type StoryStatus = "draft" | "published" | "archived";

export type ItemType =
  | "weapon"
  | "potion"
  | "armor"
  | "artifact"
  | "avatar_skin"
  | "chapter_unlock"
  | "ending_unlock";

export type ItemRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary";

export type TransactionType =
  | "gem_purchase"
  | "gem_spend"
  | "gem_reward"
  | "story_purchase"
  | "item_purchase";

export type TransactionStatus =
  | "pending"
  | "completed"
  | "failed"
  | "refunded";

export type ChoiceEffectType =
  | "stat_modifier"
  | "inventory_add"
  | "inventory_require"
  | "flag_set"
  | "flag_require";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          avatar_skin_id: string | null;
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
          is_premium: boolean;
          preferred_lang: string;
          dark_mode: boolean;
          streak_days: number;
          streak_last_at: string | null;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          avatar_skin_id?: string | null;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
          is_premium?: boolean;
          preferred_lang?: string;
          dark_mode?: boolean;
          streak_days?: number;
          streak_last_at?: string | null;
        };
        Update: {
          id?: string;
          username?: string;
          avatar_url?: string | null;
          avatar_skin_id?: string | null;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
          is_premium?: boolean;
          preferred_lang?: string;
          dark_mode?: boolean;
          streak_days?: number;
          streak_last_at?: string | null;
        };
        Relationships: [];
      };
      wallets: {
        Row: {
          id: string;
          user_id: string;
          gems: number;
          coins: number;
          lifetime_gems: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          gems?: number;
          coins?: number;
          lifetime_gems?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          gems?: number;
          coins?: number;
          lifetime_gems?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      stories: {
        Row: {
          id: string;
          slug: string;
          title: string;
          tagline: string | null;
          description: string | null;
          cover_image_url: string | null;
          genre: StoryGenre;
          status: StoryStatus;
          is_free: boolean;
          price_gems: number | null;
          price_usd: number | null;
          revenuecat_product_id: string | null;
          estimated_playtime_min: number | null;
          min_age: number;
          author_note: string | null;
          total_nodes: number;
          total_endings: number;
          difficulty: number;
          tags: string[];
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          tagline?: string | null;
          description?: string | null;
          cover_image_url?: string | null;
          genre: StoryGenre;
          status?: StoryStatus;
          is_free?: boolean;
          price_gems?: number | null;
          price_usd?: number | null;
          revenuecat_product_id?: string | null;
          estimated_playtime_min?: number | null;
          min_age?: number;
          author_note?: string | null;
          total_nodes?: number;
          total_endings?: number;
          difficulty?: number;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          tagline?: string | null;
          description?: string | null;
          cover_image_url?: string | null;
          genre?: StoryGenre;
          status?: StoryStatus;
          is_free?: boolean;
          price_gems?: number | null;
          price_usd?: number | null;
          revenuecat_product_id?: string | null;
          estimated_playtime_min?: number | null;
          min_age?: number;
          author_note?: string | null;
          total_nodes?: number;
          total_endings?: number;
          difficulty?: number;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Relationships: [];
      };
      story_nodes: {
        Row: {
          id: string;
          story_id: string;
          node_key: string;
          title: string | null;
          content: string;
          illustration_url: string | null;
          is_start: boolean;
          is_ending: boolean;
          ending_type: string | null;
          background_music: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          story_id: string;
          node_key: string;
          title?: string | null;
          content: string;
          illustration_url?: string | null;
          is_start?: boolean;
          is_ending?: boolean;
          ending_type?: string | null;
          background_music?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          story_id?: string;
          node_key?: string;
          title?: string | null;
          content?: string;
          illustration_url?: string | null;
          is_start?: boolean;
          is_ending?: boolean;
          ending_type?: string | null;
          background_music?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      story_choices: {
        Row: {
          id: string;
          node_id: string;
          target_node_id: string | null;
          display_order: number;
          text: string;
          flavor_text: string | null;
          is_premium: boolean;
          price_gems: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          node_id: string;
          target_node_id?: string | null;
          display_order?: number;
          text: string;
          flavor_text?: string | null;
          is_premium?: boolean;
          price_gems?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          node_id?: string;
          target_node_id?: string | null;
          display_order?: number;
          text?: string;
          flavor_text?: string | null;
          is_premium?: boolean;
          price_gems?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      choice_effects: {
        Row: {
          id: string;
          choice_id: string;
          effect_type: ChoiceEffectType;
          stat_key: string | null;
          stat_value: number | null;
          item_id: string | null;
          flag_key: string | null;
          flag_value: boolean;
        };
        Insert: {
          id?: string;
          choice_id: string;
          effect_type: ChoiceEffectType;
          stat_key?: string | null;
          stat_value?: number | null;
          item_id?: string | null;
          flag_key?: string | null;
          flag_value?: boolean;
        };
        Update: {
          id?: string;
          choice_id?: string;
          effect_type?: ChoiceEffectType;
          stat_key?: string | null;
          stat_value?: number | null;
          item_id?: string | null;
          flag_key?: string | null;
          flag_value?: boolean;
        };
        Relationships: [];
      };
      user_story_progress: {
        Row: {
          id: string;
          user_id: string;
          story_id: string;
          current_node_id: string | null;
          is_completed: boolean;
          is_purchased: boolean;
          completion_pct: number;
          endings_found: string[];
          started_at: string;
          last_played_at: string;
          completed_at: string | null;
          time_spent_sec: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          story_id: string;
          current_node_id?: string | null;
          is_completed?: boolean;
          is_purchased?: boolean;
          completion_pct?: number;
          endings_found?: string[];
          started_at?: string;
          last_played_at?: string;
          completed_at?: string | null;
          time_spent_sec?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          story_id?: string;
          current_node_id?: string | null;
          is_completed?: boolean;
          is_purchased?: boolean;
          completion_pct?: number;
          endings_found?: string[];
          started_at?: string;
          last_played_at?: string;
          completed_at?: string | null;
          time_spent_sec?: number;
        };
        Relationships: [];
      };
      character_stats: {
        Row: {
          id: string;
          user_id: string;
          story_id: string;
          hp_current: number;
          hp_max: number;
          strength: number;
          agility: number;
          luck: number;
          charisma: number;
          narrative_flags: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          story_id: string;
          hp_current?: number;
          hp_max?: number;
          strength?: number;
          agility?: number;
          luck?: number;
          charisma?: number;
          narrative_flags?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          story_id?: string;
          hp_current?: number;
          hp_max?: number;
          strength?: number;
          agility?: number;
          luck?: number;
          charisma?: number;
          narrative_flags?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      items: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          icon_url: string | null;
          item_type: ItemType;
          rarity: ItemRarity;
          stat_bonus: Json;
          is_consumable: boolean;
          is_stackable: boolean;
          price_gems: number | null;
          price_usd: number | null;
          revenuecat_product_id: string | null;
          is_available: boolean;
          story_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          icon_url?: string | null;
          item_type: ItemType;
          rarity?: ItemRarity;
          stat_bonus?: Json;
          is_consumable?: boolean;
          is_stackable?: boolean;
          price_gems?: number | null;
          price_usd?: number | null;
          revenuecat_product_id?: string | null;
          is_available?: boolean;
          story_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          icon_url?: string | null;
          item_type?: ItemType;
          rarity?: ItemRarity;
          stat_bonus?: Json;
          is_consumable?: boolean;
          is_stackable?: boolean;
          price_gems?: number | null;
          price_usd?: number | null;
          revenuecat_product_id?: string | null;
          is_available?: boolean;
          story_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      user_inventory: {
        Row: {
          id: string;
          user_id: string;
          item_id: string;
          quantity: number;
          is_equipped: boolean;
          acquired_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_id: string;
          quantity?: number;
          is_equipped?: boolean;
          acquired_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_id?: string;
          quantity?: number;
          is_equipped?: boolean;
          acquired_at?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: TransactionType;
          status: TransactionStatus;
          amount_usd: number | null;
          currency: string;
          gems_delta: number;
          coins_delta: number;
          revenuecat_transaction_id: string | null;
          store_product_id: string | null;
          platform: string | null;
          item_id: string | null;
          story_id: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: TransactionType;
          status?: TransactionStatus;
          amount_usd?: number | null;
          currency?: string;
          gems_delta?: number;
          coins_delta?: number;
          revenuecat_transaction_id?: string | null;
          store_product_id?: string | null;
          platform?: string | null;
          item_id?: string | null;
          story_id?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: TransactionType;
          status?: TransactionStatus;
          amount_usd?: number | null;
          currency?: string;
          gems_delta?: number;
          coins_delta?: number;
          revenuecat_transaction_id?: string | null;
          store_product_id?: string | null;
          platform?: string | null;
          item_id?: string | null;
          story_id?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      gem_packs: {
        Row: {
          id: string;
          name: string;
          gems_amount: number;
          bonus_gems: number;
          price_usd: number;
          revenuecat_product_id: string;
          icon_url: string | null;
          is_featured: boolean;
          is_available: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          gems_amount: number;
          bonus_gems?: number;
          price_usd: number;
          revenuecat_product_id: string;
          icon_url?: string | null;
          is_featured?: boolean;
          is_available?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          gems_amount?: number;
          bonus_gems?: number;
          price_usd?: number;
          revenuecat_product_id?: string;
          icon_url?: string | null;
          is_featured?: boolean;
          is_available?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      achievements: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          icon_url: string | null;
          reward_gems: number;
          reward_coins: number;
          condition_type: string;
          condition_value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          icon_url?: string | null;
          reward_gems?: number;
          reward_coins?: number;
          condition_type: string;
          condition_value: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          icon_url?: string | null;
          reward_gems?: number;
          reward_coins?: number;
          condition_type?: string;
          condition_value?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          unlocked_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          unlocked_at?: string;
        };
        Relationships: [];
      };
      choice_history: {
        Row: {
          id: string;
          user_id: string;
          story_id: string;
          node_id: string;
          choice_id: string;
          chosen_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          story_id: string;
          node_id: string;
          choice_id: string;
          chosen_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          story_id?: string;
          node_id?: string;
          choice_id?: string;
          chosen_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      /**
       * Débit de gemmes + octroi d'inventaire pour un objet de boutique
       * (SECURITY DEFINER — migration 004, prix revalidé serveur).
       */
      purchase_item: {
        Args: { p_item_id: string };
        Returns: Json;
      };
      /**
       * Achat d'une histoire payante avec des gemmes + déverrouillage
       * (SECURITY DEFINER — migration 005, prix revalidé serveur).
       */
      purchase_story: {
        Args: { p_story_id: string };
        Returns: Json;
      };
      /** Débloque les succès éligibles (conditions revalidées serveur). */
      claim_achievements: {
        Args: { p_user_id?: string };
        Returns: Json;
      };
    };
    Enums: {
      story_genre: StoryGenre;
      story_status: StoryStatus;
      item_type: ItemType;
      item_rarity: ItemRarity;
      transaction_type: TransactionType;
      transaction_status: TransactionStatus;
      choice_effect_type: ChoiceEffectType;
    };
    CompositeTypes: Record<string, never>;
  };
}
