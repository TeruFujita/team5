"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function VideosPage() {
  const { user, signOut } = useAuth();

  // サンプル動画データ
  const sampleVideos = [
    {
      id: 1,
      title: "はじめしゃちょー結婚しました。",
      channel: "はじめしゃちょー",
      thumbnail: "/40e6ebd4dddbca6e172ca97aeb877556f2fd4c47.png",
      views: "1.2M",
      duration: "15:30"
    },
    {
      id: 2,
      title: "伝統工芸：和傘の制作過程",
      channel: "職人チャンネル",
      thumbnail: "/774845fe643ab4ea7cdc8c83575873598c78732e.png",
      views: "856K",
      duration: "22:15"
    },
    {
      id: 3,
      title: "芸者の舞踊：古典芸能の美",
      channel: "日本文化保存会",
      thumbnail: "/40e6ebd4dddbca6e172ca97aeb877556f2fd4c47.png",
      views: "432K",
      duration: "18:45"
    }
  ];

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
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="動画を検索..."
              className="w-full px-4 py-3 pl-10 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b40808] focus:border-transparent outline-none"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 動画グリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleVideos.map((video) => (
            <Link 
              key={video.id} 
              href={`/videos/${video.id}`}
              className="bg-[#f5f0d8] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow block"
            >
              <div className="relative">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={400}
                  height={225}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{video.channel}</p>
                <p className="text-gray-500 text-sm">{video.views} 回視聴</p>
              </div>
            </Link>
          ))}
        </div>

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
