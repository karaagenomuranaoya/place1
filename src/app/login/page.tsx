"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // 新規登録用
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSignUp) {
      // 新規登録
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }, // トリガー経由でprofilesテーブルに入ります
        },
      });
      if (error) setError(error.message);
      else alert("確認メールを送信しました！リンクをクリックしてください。");
    } else {
      // ログイン
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
      else router.push("/"); // ログイン成功したらトップへ
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-black text-place-blue">Place</h1>
          <p className="mt-2 text-gray-500">
            {isSignUp ? "アカウントを作成して、輝き始める" : "輝きの場所へ戻る"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-place-blue focus:outline-none focus:ring-1 focus:ring-place-blue"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-place-blue focus:outline-none focus:ring-1 focus:ring-place-blue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-place-blue focus:outline-none focus:ring-1 focus:ring-place-blue"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center font-bold">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-full bg-place-blue px-4 py-2 text-white font-bold hover:bg-blue-500 transition-colors"
          >
            {isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>

        <div className="text-center text-sm">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-place-blue hover:underline"
          >
            {isSignUp
              ? "すでにアカウントをお持ちですか？ログイン"
              : "アカウントをお持ちでないですか？新規登録"}
          </button>
        </div>
      </div>
    </div>
  );
}