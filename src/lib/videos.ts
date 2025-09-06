import { supabase } from './supabase';

export interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  duration: number | null;
  view_count: number;
  like_count: number;
  is_published: boolean;
  user_id: string;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  // 関連データ
  user?: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
  category?: {
    id: string;
    name: string;
  };
}

export interface VideoWithDetails extends Video {
  comments: Comment[];
  tags: Tag[];
}

export interface Comment {
  id: string;
  text: string;
  user_id: string;
  video_id: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
}

export interface Tag {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

// 動画一覧を取得
export async function getVideos(limit: number = 20, offset: number = 0, sortBy: 'newest' | 'popular' | 'trending' = 'newest'): Promise<Video[]> {
  try {
    let orderBy: any = { column: 'created_at', ascending: false };
    
    switch (sortBy) {
      case 'popular':
        orderBy = { column: 'view_count', ascending: false };
        break;
      case 'trending':
        // 最近7日間のいいね数でソート（簡易版）
        orderBy = { column: 'like_count', ascending: false };
        break;
      default:
        orderBy = { column: 'created_at', ascending: false };
    }

    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        user:users(id, name, avatar),
        category:categories(id, name)
      `)
      .eq('is_published', true)
      .order(orderBy.column, { ascending: orderBy.ascending })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
}

// 特定の動画を取得
export async function getVideoById(id: string): Promise<VideoWithDetails | null> {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        user:users(id, name, avatar),
        category:categories(id, name),
        comments:comments(
          *,
          user:users(id, name, avatar)
        ),
        video_tags(
          tag:tags(id, name)
        )
      `)
      .eq('id', id)
      .eq('is_published', true)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    // タグデータを整形
    const tags = data.video_tags?.map((vt: any) => vt.tag).filter(Boolean) || [];

    return {
      ...data,
      tags
    };
  } catch (error) {
    console.error('Error fetching video:', error);
    return null;
  }
}

// 動画の視聴回数を増加
export async function incrementViewCount(videoId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('videos')
      .update({ view_count: supabase.sql`view_count + 1` })
      .eq('id', videoId);

    if (error) {
      console.error('Error incrementing view count:', error);
    }
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
}

// 動画を検索
export async function searchVideos(query: string, limit: number = 20): Promise<Video[]> {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        user:users(id, name, avatar),
        category:categories(id, name)
      `)
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error searching videos:', error);
    return [];
  }
}

// カテゴリ別動画を取得
export async function getVideosByCategory(categoryId: string, limit: number = 20): Promise<Video[]> {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        user:users(id, name, avatar),
        category:categories(id, name)
      `)
      .eq('is_published', true)
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching videos by category:', error);
    return [];
  }
}

// ユーザーの動画を取得
export async function getUserVideos(userId: string, limit: number = 20): Promise<Video[]> {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        user:users(id, name, avatar),
        category:categories(id, name)
      `)
      .eq('user_id', userId)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user videos:', error);
    return [];
  }
}

// カテゴリ一覧を取得
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// 人気動画を取得（視聴回数順）
export async function getPopularVideos(limit: number = 10): Promise<Video[]> {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        user:users(id, name, avatar),
        category:categories(id, name)
      `)
      .eq('is_published', true)
      .order('view_count', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching popular videos:', error);
    return [];
  }
}

// トレンド動画を取得（いいね数順）
export async function getTrendingVideos(limit: number = 10): Promise<Video[]> {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        user:users(id, name, avatar),
        category:categories(id, name)
      `)
      .eq('is_published', true)
      .order('like_count', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    return [];
  }
}
