import { supabase } from './supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface VideoUploadData {
  title: string;
  description: string;
  category: string;
  tags: string[];
}

// 動画ファイルをSupabase Storageにアップロード
export async function uploadVideo(
  file: File,
  userId: string
): Promise<UploadResult> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(fileName, file);

    if (error) {
      return { success: false, error: error.message };
    }

    // 公開URLを取得
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(fileName);

    return { success: true, url: publicUrl };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'アップロードに失敗しました' 
    };
  }
}

// サムネイル画像をSupabase Storageにアップロード
export async function uploadThumbnail(
  file: File,
  userId: string
): Promise<UploadResult> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('thumbnails')
      .upload(fileName, file);

    if (error) {
      return { success: false, error: error.message };
    }

    // 公開URLを取得
    const { data: { publicUrl } } = supabase.storage
      .from('thumbnails')
      .getPublicUrl(fileName);

    return { success: true, url: publicUrl };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'サムネイルのアップロードに失敗しました' 
    };
  }
}

// 動画データをデータベースに保存
export async function saveVideoToDatabase(
  videoData: VideoUploadData,
  videoUrl: string,
  thumbnailUrl: string,
  userId: string
): Promise<UploadResult> {
  try {
    const { data, error } = await supabase
      .from('videos')
      .insert([
        {
          title: videoData.title,
          description: videoData.description,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          user_id: userId,
          is_published: true,
          view_count: 0,
          like_count: 0
        }
      ])
      .select();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'データベースへの保存に失敗しました' 
    };
  }
}

// 進捗付きアップロード
export async function uploadWithProgress(
  file: File,
  bucket: string,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        onUploadProgress: (progress) => {
          if (onProgress) {
            onProgress((progress.loaded / progress.total) * 100);
          }
        }
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // 公開URLを取得
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return { success: true, url: publicUrl };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'アップロードに失敗しました' 
    };
  }
}
