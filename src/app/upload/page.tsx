import Link from "next/link";

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-[#a70808]">
      {/* ヘッダー */}
      <header className="bg-[#f5f0d8] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-[#b40808]">
              伝統文化プラットフォーム
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
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  MP4, MOV, AVI形式、最大500MB
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
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  JPG, PNG形式、推奨サイズ: 1280x720px
                </p>
              </div>
            </div>

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
