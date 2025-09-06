"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function UploadPage() {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>("");

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ファイルサイズチェック（50MB = 50 * 1024 * 1024 bytes）
      if (file.size > 50 * 1024 * 1024) {
        setUploadError("動画ファイルは50MB以下にしてください");
        setSelectedVideo(null);
        return;
      }
      
      // ファイル形式チェック
      const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError("MP4, MOV, AVI, WebM形式のファイルのみアップロード可能です");
        setSelectedVideo(null);
        return;
      }
      
      setSelectedVideo(file);
      setUploadError("");
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ファイルサイズチェック（5MB = 5 * 1024 * 1024 bytes）
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("サムネイル画像は5MB以下にしてください");
        setSelectedThumbnail(null);
        return;
      }
      
      // ファイル形式チェック
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError("JPG, PNG, WebP形式の画像のみアップロード可能です");
        setSelectedThumbnail(null);
        return;
      }
      
      setSelectedThumbnail(file);
      setUploadError("");
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
              <Link href="/upload" className="text-[#b40808] font-medium py-2">
                動画投稿
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-[#b40808] font-medium py-2">
                ログイン
              </Link>
              <Link href="/signup" className="bg-[#b40808] text-white px-4 py-2 rounded-lg hover:bg-[#a00808] transition-colors font-medium">
                サインアップ
              </Link>
            </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[#f5f0d8] rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#b40808] mb-2">動画投稿</h1>
            <p className="text-gray-600">日本の伝統文化・技術を共有しましょう</p>
          </div>

          <form className="space-y-6">
            {/* 動画ファイルアップロード */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                動画ファイル
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#b40808] transition-colors">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="mt-4">
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      動画ファイルをドラッグ&ドロップ
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      またはクリックしてファイルを選択
                    </span>
                    <input
                      id="video-upload"
                      name="video-upload"
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  MP4, MOV, AVI形式、最大50MB
                </p>
              </div>
            </div>

            {/* サムネイル */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                サムネイル画像
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#b40808] transition-colors">
                <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="mt-2">
                  <label htmlFor="thumbnail-upload" className="cursor-pointer">
                    <span className="text-sm font-medium text-gray-900">サムネイルをアップロード</span>
                    <input
                      id="thumbnail-upload"
                      name="thumbnail-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  JPG, PNG形式、最大5MB、推奨サイズ: 1280x720px
                </p>
              </div>
            </div>

            {/* エラーメッセージ */}
            {uploadError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {uploadError}
              </div>
            )}

            {/* 選択されたファイルの表示 */}
            {selectedVideo && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <p>選択された動画: {selectedVideo.name}</p>
                <p className="text-sm">サイズ: {(selectedVideo.size / (1024 * 1024)).toFixed(2)}MB</p>
              </div>
            )}

            {selectedThumbnail && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <p>選択されたサムネイル: {selectedThumbnail.name}</p>
                <p className="text-sm">サイズ: {(selectedThumbnail.size / (1024 * 1024)).toFixed(2)}MB</p>
              </div>
            )}

            {/* タイトル */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                タイトル
              </label>
              <input
                type="text"
                id="title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b40808] focus:border-transparent outline-none"
                placeholder="動画のタイトルを入力してください"
              />
            </div>

            {/* 説明 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                説明
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b40808] focus:border-transparent outline-none"
                placeholder="動画の内容や伝統文化について説明してください"
              />
            </div>

            {/* カテゴリ */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリ
              </label>
              <select
                id="category"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b40808] focus:border-transparent outline-none"
              >
                <option value="">カテゴリを選択してください</option>
                <option value="crafts">伝統工芸</option>
                <option value="performing-arts">伝統芸能</option>
                <option value="cooking">伝統料理</option>
                <option value="architecture">伝統建築</option>
                <option value="festivals">祭り・行事</option>
                <option value="other">その他</option>
              </select>
            </div>

            {/* タグ */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                タグ（カンマ区切り）
              </label>
              <input
                type="text"
                id="tags"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b40808] focus:border-transparent outline-none"
                placeholder="例: 和傘, 職人, 京都, 伝統工芸"
              />
            </div>

            {/* 公開設定 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                公開設定
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="visibility" value="public" className="text-[#b40808] focus:ring-[#b40808]" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">公開（誰でも視聴可能）</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="visibility" value="unlisted" className="text-[#b40808] focus:ring-[#b40808]" />
                  <span className="ml-2 text-sm text-gray-700">限定公開（リンクを知っている人のみ）</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="visibility" value="private" className="text-[#b40808] focus:ring-[#b40808]" />
                  <span className="ml-2 text-sm text-gray-700">非公開（自分だけ）</span>
                </label>
              </div>
            </div>

            {/* 投稿ボタン */}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-[#b40808] text-white py-3 rounded-lg font-medium hover:bg-[#a00808] transition-colors"
              >
                動画を投稿
              </button>
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                下書き保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
