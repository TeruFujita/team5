"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    avatar_url: ""
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [message, setMessage] = useState("");

  // 既存のプロフィール情報を取得
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setProfile({
            username: profileData.username || "",
            avatar_url: profileData.avatar_url || ""
          });
          setAvatarPreview(profileData.avatar_url || "");
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  // アバター画像の選択
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ファイルサイズチェック（5MB以下）
      if (file.size > 5 * 1024 * 1024) {
        setMessage("アバター画像は5MB以下にしてください");
        return;
      }

      // ファイル形式チェック
      if (!file.type.startsWith('image/')) {
        setMessage("画像ファイルを選択してください");
        return;
      }

      setAvatarFile(file);
      
      // プレビュー用のURLを作成
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // プロフィール更新
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setMessage("");

      let avatarUrl = profile.avatar_url;

      // アバター画像をアップロード
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        avatarUrl = publicUrlData.publicUrl;
      }

      // プロフィール情報を更新
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          username: profile.username,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        });

      if (updateError) {
        throw updateError;
      }

      setMessage("プロフィールが更新されました！");
      setTimeout(() => {
        router.push('/profile');
      }, 1500);

    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage(`エラーが発生しました: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">ログインが必要です</h1>
            <p className="text-white/80 mb-8">プロフィールを編集するにはログインしてください</p>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">プロフィール編集</h1>
            <p className="text-gray-600">プロフィール情報を編集できます</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* アバター画像 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                プロフィール画像
              </label>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="プロフィール画像プレビュー"
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
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#b40808] file:text-white hover:file:bg-[#a00808]"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    JPG、PNG、GIF形式、5MB以下
                  </p>
                </div>
              </div>
            </div>

            {/* ユーザー名 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                ユーザー名
              </label>
              <input
                type="text"
                id="username"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b40808] focus:border-transparent outline-none"
                placeholder="ユーザー名を入力"
                required
              />
            </div>

            {/* メッセージ */}
            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes('エラー') 
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
                disabled={loading}
                className="bg-[#b40808] text-white px-6 py-3 rounded-lg hover:bg-[#a00808] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "更新中..." : "プロフィールを更新"}
              </button>
              <Link
                href="/profile"
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
