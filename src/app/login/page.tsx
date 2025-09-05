import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#a70808] flex items-center justify-center">
      <div className="bg-[#f5f0d8] rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#b40808] mb-2">ログイン</h1>
          <p className="text-gray-600">アカウントにログインしてください</p>
        </div>

        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b40808] focus:border-transparent outline-none"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              パスワード
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b40808] focus:border-transparent outline-none"
              placeholder="パスワードを入力"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-[#b40808] focus:ring-[#b40808]" />
              <span className="ml-2 text-sm text-gray-600">ログイン状態を保持</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-[#b40808] hover:underline">
              パスワードを忘れた方
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#b40808] text-white py-3 rounded-lg font-medium hover:bg-[#a00808] transition-colors"
          >
            ログイン
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            アカウントをお持ちでない方は{" "}
            <Link href="/signup" className="text-[#b40808] hover:underline font-medium">
              新規登録
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-[#b40808] hover:underline">
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
