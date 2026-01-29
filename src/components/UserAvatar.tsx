import Image from "next/image";

type Props = {
  src?: string | null;
  username?: string;
  size?: "sm" | "md" | "lg" | "xl"; // サイズバリエーション
};

export default function UserAvatar({ src, username, size = "md" }: Props) {
  // サイズ定義
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <div className={`relative rounded-full overflow-hidden bg-gray-200 shrink-0 ${sizeClasses[size]}`}>
      {src ? (
        <Image
          src={src}
          alt={username || "User"}
          fill
          className="object-cover"
        />
      ) : (
        // 画像がない場合のプレースホルダー
        <div className="flex items-center justify-center w-full h-full text-gray-400 font-bold text-xs">
          {username ? username.slice(0, 2).toUpperCase() : "??"}
        </div>
      )}
    </div>
  );
}