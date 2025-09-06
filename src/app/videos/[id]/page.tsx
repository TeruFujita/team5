"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getVideoById, incrementViewCount, VideoWithDetails } from "@/lib/videos";
import { toggleLike, toggleSave, addComment, getUserLikeStatus, getUserSaveStatus } from "@/lib/interactions";

export default function VideoDetailPage() {
  const { user, signOut } = useAuth();
  const params = useParams();
  const videoId = params.id as string;
  
  const [video, setVideo] = useState<VideoWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [isInteracting, setIsInteracting] = useState(false);

  // 動画データを取得
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const videoData = await getVideoById(videoId);
        
        if (!videoData) {
          setError("動画が見つかりません");
          return;
        }
        
        setVideo(videoData);
        
        // 視聴回数を増加
        await incrementViewCount(videoId);

        // ユーザーのいいね・保存状態を取得
        if (user) {
          const [likeStatus, saveStatus] = await Promise.all([
            getUserLikeStatus(videoId, user.id),
            getUserSaveStatus(videoId, user.id)
          ]);
          setIsLiked(likeStatus);
          setIsSaved(saveStatus);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
        setError("動画の読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  // ローディング状態
  if (loading) {
    return (
      <main className="min-h-screen bg-[#a70808] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>動画を読み込み中...</p>
        </div>
      </main>
    );
  }

  // エラー状態
  if (error || !video) {
    return (
      <main className="min-h-screen bg-[#a70808] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">{error || "動画が見つかりません"}</h1>
          <Link href="/videos" className="text-[#f5f0d8] hover:underline">
            動画一覧に戻る
          </Link>
        </div>
      </main>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        user: "あなた",
        text: comment,
        time: "今"
      };
      setComments([newComment, ...comments]);
      setComment("");
    }
  };

  return (
    <main className="min-h-screen bg-[#a70808]">
      {/* ヘッダー */}
      <header className="bg-[#f5f0d8] sticky top-0 z-50" style={{ padding: '20px 30px', minHeight: '80px' }}>
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/結継.png" 
              alt="結継" 
              width={200} 
              height={60} 
              style={{ height: '60px', width: 'auto' }}
            />
          </Link>
            <nav className="flex items-center space-x-8">
              <Link href="/videos" className="text-gray-700 hover:text-[#b40808] font-medium py-2">
                動画視聴
              </Link>
              <Link href="/upload" className="text-gray-700 hover:text-[#b40808] font-medium py-2">
                動画投稿
              </Link>
              {user ? (
                <>
                  <span className="text-gray-700 font-medium py-2">
                    こんにちは、{user.user_metadata?.name || user.email}さん
                  </span>
                  <button 
                    onClick={signOut}
                    className="bg-[#b40808] text-white px-4 py-2 rounded-lg hover:bg-[#a00808] transition-colors font-medium"
                  >
                    ログアウト
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-[#b40808] font-medium py-2">
                    ログイン
                  </Link>
                  <Link href="/signup" className="bg-[#b40808] text-white px-4 py-2 rounded-lg hover:bg-[#a00808] transition-colors font-medium">
                    サインアップ
                  </Link>
                </>
              )}
            </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-6">
            {/* 動画プレイヤー */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <div className="aspect-video">
                <video
                  controls
                  className="w-full h-full"
                  poster={video.thumbnail_url || undefined}
                >
                  <source src={video.video_url} type="video/mp4" />
                  お使いのブラウザは動画の再生をサポートしていません。
                </video>
              </div>
            </div>

            {/* 動画情報 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleLike}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isLiked 
                          ? 'bg-[#b40808] text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span>{video.like_count}</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isSaved 
                          ? 'bg-[#b40808] text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                      </svg>
                      <span>保存</span>
                    </button>
                  </div>
                </div>
                <div className="text-sm text-white">
                  {video.view_count.toLocaleString()} 回視聴 • {video.created_at ? new Date(video.created_at).toLocaleDateString('ja-JP') : ''}
                </div>
              </div>

              {/* チャンネル情報 */}
              <div className="flex items-center space-x-4 p-4 bg-[#f5f0d8] rounded-lg">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  {video.user?.avatar ? (
                    <Image
                      src={video.user.avatar}
                      alt={video.user.name || "ユーザー"}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 font-bold">
                      {(video.user?.name || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{video.user?.name || "匿名ユーザー"}</h3>
                  <p className="text-sm text-gray-600">投稿者</p>
                </div>
                {user && user.id !== video.user_id && (
                  <button className="ml-auto bg-[#b40808] text-white px-4 py-2 rounded-lg hover:bg-[#a00808] transition-colors">
                    フォロー
                  </button>
                )}
              </div>

              {/* 説明 */}
              <div className="bg-[#f5f0d8] rounded-lg p-4">
                <h4 className="font-semibold mb-2">説明</h4>
                <p className="text-gray-700">
                  {video.description || "説明はありません"}
                </p>
                {video.tags && video.tags.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">タグ</h5>
                    <div className="flex flex-wrap gap-2">
                      {video.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded"
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* コメント欄 */}
            <div className="bg-[#f5f0d8] rounded-lg p-4">
              <h4 className="font-semibold mb-4">コメント ({video.comments?.length || 0})</h4>
              
              {/* コメント投稿フォーム */}
              {user && (
                <form onSubmit={handleCommentSubmit} className="mb-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="コメントを入力..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b40808] focus:border-transparent outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-[#b40808] text-white px-4 py-2 rounded-lg hover:bg-[#a00808] transition-colors"
                    >
                      投稿
                    </button>
                  </div>
                </form>
              )}

              {!user && (
                <div className="mb-4 p-3 bg-gray-100 rounded-lg text-center">
                  <p className="text-gray-600 text-sm">コメントするには<Link href="/login" className="text-[#b40808] hover:underline">ログイン</Link>してください</p>
                </div>
              )}

              {/* コメント一覧 */}
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {video.comments && video.comments.length > 0 ? (
                  video.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        {comment.user?.avatar ? (
                          <Image
                            src={comment.user.avatar}
                            alt={comment.user.name || "ユーザー"}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-600 text-sm font-bold">
                            {(comment.user?.name || "U").charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-sm">{comment.user?.name || "匿名ユーザー"}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString('ja-JP')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">まだコメントがありません</p>
                )}
              </div>
            </div>

            {/* 関連動画 */}
            <div className="bg-[#f5f0d8] rounded-lg p-4">
              <h4 className="font-semibold mb-4">関連動画</h4>
              <div className="space-y-3">
                {sampleVideos.filter(v => v.id !== video.id).slice(0, 3).map((relatedVideo) => (
                  <Link 
                    key={relatedVideo.id} 
                    href={`/videos/${relatedVideo.id}`}
                    className="flex space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="w-24 h-16 bg-gray-300 rounded flex-shrink-0">
                      <Image
                        src={relatedVideo.thumbnail}
                        alt={relatedVideo.title}
                        width={96}
                        height={64}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {relatedVideo.title}
                      </h5>
                      <p className="text-xs text-gray-600 mt-1">{relatedVideo.channel}</p>
                      <p className="text-xs text-gray-500">{relatedVideo.views} 回視聴 • {relatedVideo.duration}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
