"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getVideos, searchVideos, Video } from "@/lib/videos";

export default function VideosPage() {
  const { user, signOut } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 動画データを取得
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const videoData = await getVideos();
        setVideos(videoData);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // 検索処理
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchVideos(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching videos:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // 表示する動画リストを決定
  const displayVideos = isSearching ? searchResults : videos;

  // 視聴回数をフォーマット
  const formatViewCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // 時間をフォーマット
  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">動画一覧</h1>
          <p className="text-white/80">日本の伝統文化・技術を学べる動画を視聴できます</p>
        </div>

        {/* 検索バー */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="動画を検索..."
              className="w-full px-4 py-3 pl-10 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b40808] focus:border-transparent outline-none"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              type="submit"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-gray-400 hover:text-[#b40808]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* ローディング状態 */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <span className="ml-3 text-white">動画を読み込み中...</span>
          </div>
        )}

        {/* 検索結果がない場合 */}
        {!loading && isSearching && searchResults.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/80 text-lg">「{searchQuery}」の検索結果が見つかりませんでした</p>
          </div>
        )}

        {/* 動画がない場合 */}
        {!loading && !isSearching && videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/80 text-lg">まだ動画が投稿されていません</p>
            <Link 
              href="/upload" 
              className="inline-block mt-4 bg-[#b40808] text-white px-6 py-3 rounded-lg hover:bg-[#a00808] transition-colors"
            >
              最初の動画を投稿する
            </Link>
          </div>
        )}

        {/* 動画グリッド */}
        {!loading && displayVideos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayVideos.map((video) => (
              <Link 
                key={video.id} 
                href={`/videos/${video.id}`}
                className="bg-[#f5f0d8] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow block"
              >
                <div className="relative">
                  <Image
                    src={video.thumbnail_url || "/placeholder-video.jpg"}
                    alt={video.title}
                    width={400}
                    height={225}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {video.user?.name || "匿名ユーザー"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {formatViewCount(video.view_count)} 回視聴
                  </p>
                  {video.category && (
                    <span className="inline-block mt-2 px-2 py-1 bg-[#b40808] text-white text-xs rounded">
                      {video.category.name}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* もっと見るボタン */}
        <div className="text-center mt-8">
          <button className="bg-[#f5f0d8] text-[#b40808] px-6 py-3 rounded-lg font-medium hover:bg-white transition-colors">
            もっと見る
          </button>
        </div>
      </div>
    </main>
  );
}
