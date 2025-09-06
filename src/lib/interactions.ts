import { supabase } from './supabase';

// いいね機能
export async function toggleLike(videoId: string, userId: string): Promise<{ success: boolean; isLiked: boolean; error?: string }> {
  try {
    // 既存のいいねをチェック
    const { data: existingLike, error: checkError } = await supabase
      .from('likes')
      .select('id')
      .eq('video_id', videoId)
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingLike) {
      // いいねを削除
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .eq('video_id', videoId)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // 動画のいいね数を減らす
      await supabase.rpc('decrement_like_count', { video_id: videoId });

      return { success: true, isLiked: false };
    } else {
      // いいねを追加
      const { error: insertError } = await supabase
        .from('likes')
        .insert({ video_id: videoId, user_id: userId });

      if (insertError) throw insertError;

      // 動画のいいね数を増やす
      await supabase.rpc('increment_like_count', { video_id: videoId });

      return { success: true, isLiked: true };
    }
  } catch (error) {
    return { 
      success: false, 
      isLiked: false, 
      error: error instanceof Error ? error.message : 'いいねの処理に失敗しました' 
    };
  }
}

// 保存機能
export async function toggleSave(videoId: string, userId: string): Promise<{ success: boolean; isSaved: boolean; error?: string }> {
  try {
    // 既存の保存をチェック
    const { data: existingSave, error: checkError } = await supabase
      .from('saves')
      .select('id')
      .eq('video_id', videoId)
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingSave) {
      // 保存を削除
      const { error: deleteError } = await supabase
        .from('saves')
        .delete()
        .eq('video_id', videoId)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      return { success: true, isSaved: false };
    } else {
      // 保存を追加
      const { error: insertError } = await supabase
        .from('saves')
        .insert({ video_id: videoId, user_id: userId });

      if (insertError) throw insertError;

      return { success: true, isSaved: true };
    }
  } catch (error) {
    return { 
      success: false, 
      isSaved: false, 
      error: error instanceof Error ? error.message : '保存の処理に失敗しました' 
    };
  }
}

// コメント投稿
export async function addComment(videoId: string, userId: string, text: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('comments')
      .insert({
        video_id: videoId,
        user_id: userId,
        text: text
      });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'コメントの投稿に失敗しました' 
    };
  }
}

// ユーザーのいいね状態を取得
export async function getUserLikeStatus(videoId: string, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('video_id', videoId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking like status:', error);
    return false;
  }
}

// ユーザーの保存状態を取得
export async function getUserSaveStatus(videoId: string, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('saves')
      .select('id')
      .eq('video_id', videoId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking save status:', error);
    return false;
  }
}

// ユーザーの保存済み動画を取得
export async function getUserSavedVideos(userId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('saves')
      .select(`
        *,
        video:videos(
          *,
          user:users(id, name, avatar),
          category:categories(id, name)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(save => save.video).filter(Boolean) || [];
  } catch (error) {
    console.error('Error fetching saved videos:', error);
    return [];
  }
}
