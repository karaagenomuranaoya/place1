"use client";

import { toggleLike } from "@/app/actions";
import { Heart } from "lucide-react";
import { useOptimistic, startTransition } from "react";

type Props = {
  postId: string;
  initialCount: number;
  initialIsLiked: boolean;
};

export default function LikeButton({ postId, initialCount, initialIsLiked }: Props) {
  // useOptimistic: サーバー通信を待たずに画面を切り替えるためのReactフック
  const [optimisticState, addOptimistic] = useOptimistic(
    { count: initialCount, isLiked: initialIsLiked },
    (currentState, newIsLiked: boolean) => ({
      count: newIsLiked ? currentState.count + 1 : currentState.count - 1,
      isLiked: newIsLiked,
    })
  );

  const handleClick = async () => {
    // 1. まず見た目を即座に更新 (Optimistic Update)
    startTransition(() => {
      addOptimistic(!optimisticState.isLiked);
    });

    // 2. 裏でサーバー処理を実行
    await toggleLike(postId);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center space-x-2 text-gray-400 group transition-colors"
    >
      <div className={`p-2 rounded-full group-hover:bg-pink-50 transition-colors ${
        optimisticState.isLiked ? "text-pink-500" : ""
      }`}>
        <Heart
          className={`w-5 h-5 transition-all ${
            optimisticState.isLiked ? "fill-pink-500 scale-110" : "scale-100"
          }`}
        />
      </div>
      <span className={`text-sm font-medium ${
         optimisticState.isLiked ? "text-pink-500" : ""
      }`}>
        {optimisticState.count > 0 ? optimisticState.count : ""}
      </span>
    </button>
  );
}