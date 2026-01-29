"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addPost(formData: FormData) {
  const supabase = await createClient();

  // 1. ユーザー確認
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  // 2. フォームから内容を取得
  const content = formData.get("content") as string;

  if (!content || content.trim().length === 0) {
    return;
  }

  // 3. DBに保存
  await supabase.from("posts").insert({
    user_id: user.id,
    content: content,
  });

  // 4. キャッシュを更新して画面に即反映
  revalidatePath("/");
}

export async function toggleLike(postId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return; // 未ログインなら何もしない

  // すでにいいねしているかチェック
  const { data: existingLike } = await supabase
    .from("likes")
    .select()
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .single();

  if (existingLike) {
    // 既にある場合は削除 (いいね解除)
    await supabase.from("likes").delete().eq("id", existingLike.id);
  } else {
    // ない場合は作成 (いいね)
    await supabase.from("likes").insert({
      user_id: user.id,
      post_id: postId,
    });
  }

  // 画面の数字をサーバーデータと同期（重要）
  revalidatePath("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();
  
  // 1. ユーザー確認
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // 2. ファイル取得
  const file = formData.get("file") as File;
  if (!file) return;

  // ファイル名: userId/現在時刻.拡張子 (キャッシュ避けと整理のため)
  const fileExt = file.name.split('.').pop();
  const filePath = `${user.id}/${Date.now()}.${fileExt}`;

  // 3. Storageにアップロード
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error(uploadError);
    throw new Error("Upload failed");
  }

  // 4. 公開URLを取得
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  // 5. プロフィールテーブルを更新
  await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  // 6. 画面更新
  revalidatePath("/profile");
  revalidatePath("/");
}

export async function deletePost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // 自分の投稿であることを確認して削除
  // (RLSポリシーでも弾かれますが、念の為ここでも user_id を指定します)
  await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id);

  // タイムラインとマイページの両方を更新
  revalidatePath("/");
  revalidatePath("/profile");
}