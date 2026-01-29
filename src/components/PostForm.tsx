"use client";

import { addPost } from "@/app/actions";
import { useRef } from "react";

export default function PostForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      action={async (formData) => {
        await addPost(formData);
        formRef.current?.reset(); // 送信後にフォームを空にする
      }}
      ref={formRef}
      className="w-full mb-8"
    >
      <div className="relative">
        <textarea
          name="content"
          placeholder="今、何を感じていますか？"
          className="w-full p-4 bg-transparent border-b border-gray-200 focus:border-place-blue focus:ring-0 outline-none resize-none text-lg min-h-[100px]"
          required
        />
        <div className="absolute bottom-2 right-2">
          <button
            type="submit"
            className="bg-place-blue text-white font-bold py-2 px-6 rounded-full hover:bg-blue-500 transition-all shadow-md"
          >
            Post
          </button>
        </div>
      </div>
    </form>
  );
}