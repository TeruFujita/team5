"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { getVideoById } from "@/lib/videos";
import { updateVideo } from "@/lib/video-management";
import { getCategories } from "@/lib/videos";
import { VideoWithDetails, Category } from "@/lib/videos";

export default function EditVideoPage() {
  const { user, signOut } = useAuth();
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;

  const [video, setVideo] = useState<VideoWithDetails | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    is_published: true
  });

  // 動画データとカテゴリを取得
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !videoId) return;

      try {
        setLoading(true);
        const [videoData, categoryData] = await Promise.all([
          getVideoById(videoId),
          getCategories()
        ]);

        if (!videoData) {
          setMessage("動画が見つかりません");
          return;
        }

        // 動画の所有者を確認
        if (videoData.user_id !== user.id) {
          setMessage("この動画を編集する権限がありません");
          return;
        }

        setVideo(videoData);
        setCategories(categoryData);

        // フォームデータを設定
        setFormData({
          title: videoData.title,
          description: videoData.description || "",
          category: videoData.category?.name || "",
          tags: videoData.tags.map(tag => tag.name).join(", "),
          is_published: videoData.is_published
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, videoId]);

  // フォーム入力の処理
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !videoId) return;

    try {
      setSaving(true);
      setMessage("");

      // タグを配列に変換
      const tagsArray = formData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const updateData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: tagsArray,
        is_published: formData.is_published
      };

      const result = await updateVideo(videoId, updateData, user.id);

      if (result.success) {
        setMessage("動画が更新されました！");
        setTimeout(() => {
          router.push('/profile/videos');
        }, 1500);
      } else {
        setMessage(`更新エラー: ${result.error}`);
      }
    } catch (error) {
      console.error('Error updating video:', error);
      setMessage('動画の更新に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">ログインが必要です</h1>
            <p className="text-white/80 mb-8">動画編集にはログインが必要です</p>
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

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </main>
    );
  }

  if (!video) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">動画が見つかりません</h1>
            <p className="text-white/80 mb-8">{message}</p>
            <Link 
              href="/profile/videos" 
              className="bg-[#b40808] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#a00808] transition-colors"
            >
              動画管理に戻る
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">動画編集</h1>
            <p className="text-gray-600">動画の情報を編集できます</p>
          </div>

          {/* 動画プレビュー */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">動画プレビュー</h2>
            <div className="relative">
              <Image
                src={video.thumbnail_url || "/placeholder-video.jpg"}
                alt={video.title}
                width={640}
                height={360}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 5v10l8-5-8-5z" />
                </svg>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* タイトル */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                タイトル *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b40808] focus:border-transparent outline-none"
                placeholder="動画のタイトルを入力"
                required
              />
            </div>

            {/* 説明 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                説明
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b40808] focus:border-transparent outline-none"
                placeholder="動画の説明を入力"
              />
            </div>

            {/* カテゴリ */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリ
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b40808] focus:border-transparent outline-none"
              >
                <option value="">カテゴリを選択</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* タグ */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                タグ
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b40808] focus:border-transparent outline-none"
                placeholder="タグをカンマ区切りで入力（例: 陶芸, 初心者, 技法）"
              />
              <p className="text-sm text-gray-500 mt-1">
                複数のタグはカンマ（,）で区切って入力してください
              </p>
            </div>

            {/* 公開設定 */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleFormChange}
                  className="h-4 w-4 text-[#b40808] focus:ring-[#b40808] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  動画を公開する
                </span>
              </label>
              <p className="text-sm text-gray-500 mt-1">
                チェックを外すと動画が非公開になります
              </p>
            </div>

            {/* メッセージ */}
            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes('エラー') || message.includes('失敗')
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {message}
              </div>
            )}

            {/* ボタン */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#b40808] text-white px-6 py-3 rounded-lg hover:bg-[#a00808] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "更新中..." : "動画を更新"}
              </button>
              <Link
                href="/profile/videos"
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                キャンセル
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
