"use client";

import { deletePost } from "@/app/actions";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export default function DeletePostButton({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    // ブラウザ標準の確認ダイアログを表示
    if (confirm("この投稿を削除しますか？\nこの操作は取り消せません。")) {
      startTransition(async () => {
        await deletePost(postId);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 ${
        isPending ? "opacity-50 cursor-not-allowed" : ""
      }`}
      title="削除する"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}