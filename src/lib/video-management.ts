import { supabase } from "./supabase";

// 動画の更新データ型
export interface VideoUpdateData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  is_published: boolean;
}

// 動画を更新
export async function updateVideo(videoId: string, updateData: VideoUpdateData, userId: string) {
  try {
    // 動画の所有者を確認
    const { data: video, error: fetchError } = await supabase
      .from('videos')
      .select('user_id')
      .eq('id', videoId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (video.user_id !== userId) {
      throw new Error('この動画を編集する権限がありません');
    }

    // カテゴリIDを取得または作成
    let categoryId: string | null = null;
    if (updateData.category) {
      const { data: existingCategory, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', updateData.category)
        .single();

      if (categoryError && categoryError.code !== 'PGRST116') {
        throw categoryError;
      }

      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const { data: newCategory, error: insertCategoryError } = await supabase
          .from('categories')
          .insert({ name: updateData.category })
          .select('id')
          .single();
        if (insertCategoryError) throw insertCategoryError;
        categoryId = newCategory.id;
      }
    }

    // 動画情報を更新
    const { error: updateError } = await supabase
      .from('videos')
      .update({
        title: updateData.title,
        description: updateData.description,
        category_id: categoryId,
        is_published: updateData.is_published,
        updated_at: new Date().toISOString()
      })
      .eq('id', videoId);

    if (updateError) throw updateError;

    // 既存のタグを削除
    const { error: deleteTagsError } = await supabase
      .from('video_tags')
      .delete()
      .eq('video_id', videoId);

    if (deleteTagsError) throw deleteTagsError;

    // 新しいタグを追加
    if (updateData.tags && updateData.tags.length > 0) {
      for (const tagName of updateData.tags) {
        // タグが存在するか確認し、なければ作成
        let tagId: string;
        const { data: existingTag, error: tagError } = await supabase
          .from('tags')
          .select('id')
          .eq('name', tagName)
          .single();

        if (tagError && tagError.code !== 'PGRST116') {
          throw tagError;
        }

        if (existingTag) {
          tagId = existingTag.id;
        } else {
          const { data: newTag, error: insertTagError } = await supabase
            .from('tags')
            .insert({ name: tagName })
            .select('id')
            .single();
          if (insertTagError) throw insertTagError;
          tagId = newTag.id;
        }

        // video_tagsテーブルに紐付け
        const { error: videoTagError } = await supabase
          .from('video_tags')
          .insert({ video_id: videoId, tag_id: tagId });

        if (videoTagError) throw videoTagError;
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error updating video:', error);
    return { success: false, error: error.message };
  }
}

// 動画を削除
export async function deleteVideo(videoId: string, userId: string) {
  try {
    // 動画の所有者を確認
    const { data: video, error: fetchError } = await supabase
      .from('videos')
      .select('user_id, video_url, thumbnail_url')
      .eq('id', videoId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (video.user_id !== userId) {
      throw new Error('この動画を削除する権限がありません');
    }

    // 関連データを削除（外部キー制約により自動削除される場合もあるが、明示的に削除）
    const { error: deleteLikesError } = await supabase
      .from('likes')
      .delete()
      .eq('video_id', videoId);

    if (deleteLikesError) {
      console.warn('Error deleting likes:', deleteLikesError);
    }

    const { error: deleteSavesError } = await supabase
      .from('saves')
      .delete()
      .eq('video_id', videoId);

    if (deleteSavesError) {
      console.warn('Error deleting saves:', deleteSavesError);
    }

    const { error: deleteCommentsError } = await supabase
      .from('comments')
      .delete()
      .eq('video_id', videoId);

    if (deleteCommentsError) {
      console.warn('Error deleting comments:', deleteCommentsError);
    }

    const { error: deleteVideoTagsError } = await supabase
      .from('video_tags')
      .delete()
      .eq('video_id', videoId);

    if (deleteVideoTagsError) {
      console.warn('Error deleting video tags:', deleteVideoTagsError);
    }

    // 動画を削除
    const { error: deleteVideoError } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);

    if (deleteVideoError) throw deleteVideoError;

    // ストレージからファイルを削除（オプション）
    // 注意: 実際のプロダクションでは、ファイルの削除は慎重に行う必要があります
    try {
      if (video.video_url) {
        const videoPath = video.video_url.split('/').pop();
        if (videoPath) {
          await supabase.storage
            .from('videos')
            .remove([`${userId}/${videoPath}`]);
        }
      }

      if (video.thumbnail_url) {
        const thumbnailPath = video.thumbnail_url.split('/').pop();
        if (thumbnailPath) {
          await supabase.storage
            .from('thumbnails')
            .remove([`${userId}/${thumbnailPath}`]);
        }
      }
    } catch (storageError) {
      console.warn('Error deleting files from storage:', storageError);
      // ストレージの削除エラーは動画削除を妨げない
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting video:', error);
    return { success: false, error: error.message };
  }
}

// ユーザーの動画一覧を取得（管理用）
export async function getUserVideosForManagement(userId: string) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        user:users(id, name, avatar),
        category:categories(id, name),
        tags:video_tags(tag_id, tag:tags(id, name))
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // tagsの整形
    const formattedData = data.map(video => ({
      ...video,
      tags: video.tags.map((vt: any) => vt.tag)
    }));

    return { success: true, videos: formattedData };
  } catch (error: any) {
    console.error('Error fetching user videos for management:', error);
    return { success: false, error: error.message, videos: [] };
  }
}
