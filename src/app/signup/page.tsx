import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#a70808] flex items-center justify-center">
      <div className="bg-[#f5f0d8] rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#b40808] mb-2">新規登録</h1>
          <p className="text-gray-600">新しいアカウントを作成してください</p>
        </div>

        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              お名前
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b40808] focus:border-transparent outline-none"
              placeholder="山田太郎"
            />
          </div>

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
              placeholder="8文字以上のパスワード"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              パスワード確認
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b40808] focus:border-transparent outline-none"
              placeholder="パスワードを再入力"
            />
          </div>

          <div className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-[#b40808] focus:ring-[#b40808]" />
            <span className="ml-2 text-sm text-gray-600">
              <Link href="/terms" className="text-[#b40808] hover:underline">
                利用規約
              </Link>
              と
              <Link href="/privacy" className="text-[#b40808] hover:underline">
                プライバシーポリシー
              </Link>
              に同意します
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-[#b40808] text-white py-3 rounded-lg font-medium hover:bg-[#a00808] transition-colors"
          >
            アカウント作成
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            既にアカウントをお持ちの方は{" "}
            <Link href="/login" className="text-[#b40808] hover:underline font-medium">
              ログイン
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
