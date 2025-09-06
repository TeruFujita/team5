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

// 動画一覧を取得
export async function getVideos(limit: number = 20, offset: number = 0): Promise<Video[]> {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        user:users(id, name, avatar),
        category:categories(id, name)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
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
    const { error } = await supabase.rpc('increment_view_count', {
      video_id: videoId
    });

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
