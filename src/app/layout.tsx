import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { BrillianceProvider } from "@/components/BrillianceProvider"; // 削除
import Header from "@/components/Header";
import { createClient } from "@/utils/supabase/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Place - Brilliance for all", // タイトル（コピー）はそのまま
  description: "誰もが輝ける場所。",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="ja">
      <body className={inter.className}>
        {/* Providerを削除し、直接中身を置く */}
        <Header user={user} />
        <div className="pt-16">
          {children}
        </div>
      </body>
    </html>
  );
}