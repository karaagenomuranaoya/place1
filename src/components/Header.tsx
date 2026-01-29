"use client";

import Link from "next/link";
import { User, LogOut, Home as HomeIcon } from "lucide-react";
import { signOut } from "@/app/actions";

export default function Header({ user }: { user: any }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* ロゴ（ホームへのリンク） */}
        <Link href="/" className="text-2xl font-black text-place-blue tracking-tighter hover:opacity-80 transition-opacity">
          Place
        </Link>

        {/* ナビゲーション */}
        <nav className="flex items-center space-x-6">
          {user ? (
            <>
              <Link href="/" className="text-gray-500 hover:text-place-blue transition-colors">
                <HomeIcon className="w-6 h-6" />
              </Link>
              <Link href="/profile" className="text-gray-500 hover:text-place-blue transition-colors">
                <User className="w-6 h-6" />
              </Link>
              <form action={signOut}>
                <button type="submit" className="text-gray-500 hover:text-red-500 transition-colors flex items-center">
                  <LogOut className="w-6 h-6" />
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="font-bold text-sm text-place-blue hover:underline">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}