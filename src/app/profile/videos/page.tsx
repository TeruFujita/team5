"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserVideosForManagement, deleteVideo } from "@/lib/video-management";
import { Video } from "@/lib/videos";

export default function VideoManagementPage() {
  const { user, signOut } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // 動画データを取得
  useEffect(() => {
    const fetchVideos = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const result = await getUserVideosForManagement(user.id);
        if (result.success) {
          setVideos(result.videos);
        } else {
          setMessage(`エラー: ${result.error}`);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        setMessage('動画の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [user]);

  // 動画削除
  const handleDeleteVideo = async (videoId: string, videoTitle: string) => {
    if (!user) return;

    const confirmed = window.confirm(
      `「${videoTitle}」を削除しますか？\nこの操作は取り消せません。`
    );

    if (!confirmed) return;

    try {
      setDeletingVideoId(videoId);
      const result = await deleteVideo(videoId, user.id);
      
      if (result.success) {
        setVideos(videos.filter(video => video.id !== videoId));
        setMessage('動画が削除されました');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`削除エラー: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      setMessage('動画の削除に失敗しました');
    } finally {
      setDeletingVideoId(null);
    }
  };

  // 視聴回数をフォーマット
  const formatViewCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // 動画の長さをフォーマット
  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 公開状態の表示
  const getStatusBadge = (isPublished: boolean) => {
    return isPublished ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        公開中
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        非公開
      </span>
    );
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">ログインが必要です</h1>
            <p className="text-white/80 mb-8">動画管理にはログインが必要です</p>
            <Link 
              href="/login" 
              className="bg-[#b40808] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#a00808] transition-colors"
            >
              ログイン
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]">
      {/* ヘッダー */}
      <header className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/結継.png"
                alt="結継"
                width={40}
                height={40}
                className="site-title-image"
              />
              <span className="text-white text-xl font-bold">結継</span>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-white hover:text-[#f5f0d8] font-medium">
                ホーム
              </Link>
              <Link href="/videos" className="text-white hover:text-[#f5f0d8] font-medium">
                動画一覧
              </Link>
              <Link href="/upload" className="text-white hover:text-[#f5f0d8] font-medium">
                アップロード
              </Link>
              <Link href="/profile" className="text-white hover:text-[#f5f0d8] font-medium">
                プロフィール
              </Link>
              {user ? (
                <>
                  <span className="text-white">こんにちは、{user.name || user.email}さん</span>
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
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">動画管理</h1>
              <p className="text-white/80">投稿した動画を管理できます</p>
            </div>
            <Link
              href="/upload"
              className="bg-[#b40808] text-white px-6 py-3 rounded-lg hover:bg-[#a00808] transition-colors font-medium"
            >
              新しい動画をアップロード
            </Link>
          </div>
        </div>

        {/* メッセージ */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('エラー') || message.includes('失敗')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        {/* ローディング状態 */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-white">まだ動画を投稿していません</h3>
            <p className="mt-1 text-sm text-white/60">最初の動画をアップロードしてみましょう！</p>
            <div className="mt-6">
              <Link
                href="/upload"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#b40808] hover:bg-[#a00808]"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                動画をアップロード
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <Image
                    src={video.thumbnail_url || "/placeholder-video.jpg"}
                    alt={video.title}
                    width={320}
                    height={225}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    {getStatusBadge(video.is_published)}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{formatViewCount(video.view_count)} 回視聴</span>
                    <span>{formatViewCount(video.like_count)} いいね</span>
                  </div>
                  {video.category && (
                    <span className="inline-block mb-3 px-2 py-1 bg-[#b40808] text-white text-xs rounded">
                      {video.category.name}
                    </span>
                  )}
                  <div className="flex space-x-2">
                    <Link
                      href={`/videos/${video.id}`}
                      className="flex-1 bg-[#b40808] text-white text-center py-2 px-3 rounded text-sm font-medium hover:bg-[#a00808] transition-colors"
                    >
                      表示
                    </Link>
                    <Link
                      href={`/profile/videos/${video.id}/edit`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      編集
                    </Link>
                    <button
                      onClick={() => handleDeleteVideo(video.id, video.title)}
                      disabled={deletingVideoId === video.id}
                      className="flex-1 bg-red-600 text-white text-center py-2 px-3 rounded text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingVideoId === video.id ? "削除中..." : "削除"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
