"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function VideoDetailPage() {
  const { user, signOut } = useAuth();
  const params = useParams();
  const videoId = params.id;
  
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "職人ファン",
      text: "素晴らしい技術ですね！勉強になります。",
      time: "2時間前"
    },
    {
      id: 2,
      user: "伝統文化愛好家",
      text: "このような技術が失われていくのは悲しいです。",
      time: "5時間前"
    }
  ]);

  // サンプル動画データ（実際の実装ではAPIから取得）
  const sampleVideos = [
    {
      id: 1,
      title: "はじめしゃちょー結婚しました。",
      channel: "はじめしゃちょー",
      thumbnail: "/40e6ebd4dddbca6e172ca97aeb877556f2fd4c47.png",
      views: "1.2M",
      duration: "15:30",
      description: "日本の伝統的な技術と文化を守り、次世代に伝えるための動画です。職人さんの丁寧な作業工程を間近で見ることができます。",
      likes: 89,
      comments: 12
    },
    {
      id: 2,
      title: "伝統工芸：和傘の制作過程",
      channel: "職人チャンネル",
      thumbnail: "/774845fe643ab4ea7cdc8c83575873598c78732e.png",
      views: "856K",
      duration: "22:15",
      description: "京都の老舗和傘職人が、一本一本手作業で和傘を作る工程を詳しく紹介します。",
      likes: 156,
      comments: 8
    },
    {
      id: 3,
      title: "芸者の舞踊：古典芸能の美",
      channel: "日本文化保存会",
      thumbnail: "/40e6ebd4dddbca6e172ca97aeb877556f2fd4c47.png",
      views: "432K",
      duration: "18:45",
      description: "京都の芸者が披露する古典舞踊の美しさを堪能できる動画です。",
      likes: 67,
      comments: 5
    }
  ];

  // 動画IDに基づいて動画データを取得
  const video = sampleVideos.find(v => v.id === parseInt(videoId as string));

  if (!video) {
    return (
      <main className="min-h-screen bg-[#a70808] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">動画が見つかりません</h1>
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
              <div className="aspect-video flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-lg">動画プレイヤー</p>
                  <p className="text-sm text-gray-300">実際の動画がここに表示されます</p>
                </div>
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
                      <span>{video.likes}</span>
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
                  {video.views} 回視聴 • {video.duration}
                </div>
              </div>

              {/* チャンネル情報 */}
              <div className="flex items-center space-x-4 p-4 bg-[#f5f0d8] rounded-lg">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-bold">{video.channel.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{video.channel}</h3>
                  <p className="text-sm text-gray-600">職人チャンネル</p>
                </div>
                <button className="ml-auto bg-[#b40808] text-white px-4 py-2 rounded-lg hover:bg-[#a00808] transition-colors">
                  フォロー
                </button>
              </div>

              {/* 説明 */}
              <div className="bg-[#f5f0d8] rounded-lg p-4">
                <h4 className="font-semibold mb-2">説明</h4>
                <p className="text-gray-700">
                  {video.description}
                </p>
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* コメント欄 */}
            <div className="bg-[#f5f0d8] rounded-lg p-4">
              <h4 className="font-semibold mb-4">コメント ({comments.length})</h4>
              
              {/* コメント投稿フォーム */}
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

              {/* コメント一覧 */}
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600 text-sm font-bold">{comment.user.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-sm">{comment.user}</span>
                        <span className="text-xs text-gray-500">{comment.time}</span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                ))}
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
