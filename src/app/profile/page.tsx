"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserVideos, Video } from "@/lib/videos";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [userVideos, setUserVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0
  });

  // ユーザー情報と動画データを取得
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // ユーザーの動画を取得
        const videos = await getUserVideos(user.id);
        setUserVideos(videos);

        // 統計情報を計算
        const totalViews = videos.reduce((sum, video) => sum + video.view_count, 0);
        const totalLikes = videos.reduce((sum, video) => sum + video.like_count, 0);
        
        setStats({
          totalVideos: videos.length,
          totalViews,
          totalLikes
        });

        // プロフィール情報を取得
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

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

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">ログインが必要です</h1>
            <p className="text-white/80 mb-8">プロフィールを表示するにはログインしてください</p>
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
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            {/* プロフィール情報 */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt="プロフィール画像"
                      width={120}
                      height={120}
                      className="w-30 h-30 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-30 h-30 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {profile?.username || user.name || "ユーザー"}
                  </h1>
                  <p className="text-gray-600 mb-4">{user.email}</p>
                  <div className="flex space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#b40808]">{stats.totalVideos}</div>
                      <div className="text-sm text-gray-600">投稿動画</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#b40808]">{formatViewCount(stats.totalViews)}</div>
                      <div className="text-sm text-gray-600">総視聴回数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#b40808]">{formatViewCount(stats.totalLikes)}</div>
                      <div className="text-sm text-gray-600">総いいね数</div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Link
                    href="/profile/edit"
                    className="bg-[#b40808] text-white px-4 py-2 rounded-lg hover:bg-[#a00808] transition-colors font-medium"
                  >
                    プロフィール編集
                  </Link>
                  <Link
                    href="/profile/videos"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    動画管理
                  </Link>
                </div>
              </div>
            </div>

            {/* 投稿動画一覧 */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">投稿動画</h2>
                <Link
                  href="/upload"
                  className="bg-[#b40808] text-white px-4 py-2 rounded-lg hover:bg-[#a00808] transition-colors font-medium"
                >
                  新しい動画をアップロード
                </Link>
              </div>

              {userVideos.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">まだ動画を投稿していません</h3>
                  <p className="mt-1 text-sm text-gray-500">最初の動画をアップロードしてみましょう！</p>
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
                  {userVideos.map((video) => (
                    <Link key={video.id} href={`/videos/${video.id}`} className="group">
                      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <Image
                            src={video.thumbnail_url || "/placeholder-video.jpg"}
                            alt={video.title}
                            width={320}
                            height={225}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                            {formatDuration(video.duration)}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#b40808] transition-colors">
                            {video.title}
                          </h3>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>{formatViewCount(video.view_count)} 回視聴</span>
                            <span>{formatViewCount(video.like_count)} いいね</span>
                          </div>
                          {video.category && (
                            <span className="inline-block mt-2 px-2 py-1 bg-[#b40808] text-white text-xs rounded">
                              {video.category.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
