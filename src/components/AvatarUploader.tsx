"use client";

import { uploadAvatar } from "@/app/actions";
import UserAvatar from "./UserAvatar";
import { Camera } from "lucide-react";
import { useRef, useState } from "react";

type Props = {
  currentAvatarUrl: string | null;
  username: string;
};

export default function AvatarUploader({ currentAvatarUrl, username }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ファイル選択時に自動送信
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      await uploadAvatar(formData);
    } catch (error) {
      alert("画像のアップロードに失敗しました");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group cursor-pointer inline-block" onClick={() => fileInputRef.current?.click()}>
      <UserAvatar src={currentAvatarUrl} username={username} size="xl" />
      
      {/* ホバー時にカメラアイコンを表示 */}
      <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Camera className="text-white w-8 h-8" />
      </div>

      {/* 隠しinput */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />
      
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-full">
           <div className="animate-spin h-5 w-5 border-2 border-place-blue border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
}