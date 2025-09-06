"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください");
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, name);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
    
    setLoading(false);
  };
  return (
    <main className="min-h-screen bg-[#a70808] flex items-center justify-center">
      <div className="bg-[#f5f0d8] rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#b40808] mb-2">新規登録</h1>
          <p className="text-gray-600">新しいアカウントを作成してください</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            アカウントが作成されました！確認メールを送信しました。ログインページに移動します...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              お名前
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b40808] focus:border-transparent outline-none"
              placeholder="山田太郎"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b40808] focus:border-transparent outline-none"
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              パスワード
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b40808] focus:border-transparent outline-none"
              placeholder="6文字以上のパスワード"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              パスワード確認
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b40808] focus:border-transparent outline-none"
              placeholder="パスワードを再入力"
              required
            />
          </div>

          <div className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-[#b40808] focus:ring-[#b40808]" required />
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
            disabled={loading}
            className="w-full bg-[#b40808] text-white py-3 rounded-lg font-medium hover:bg-[#a00808] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "アカウント作成中..." : "アカウント作成"}
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
