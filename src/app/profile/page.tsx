import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LikeButton from "@/components/LikeButton";
import AvatarUploader from "@/components/AvatarUploader"; 
import UserAvatar from "@/components/UserAvatar"; 
import DeletePostButton from "@/components/DeletePostButton"; // 追加

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: posts } = await supabase
    .from("posts")
    .select(`
      *,
      profiles (username, avatar_url),
      likes (user_id)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="flex min-h-screen flex-col items-center pt-10 pb-20 px-4 max-w-2xl mx-auto">
      {/* ...プロフィール情報部分はそのまま... */}
      <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 text-center">
         <div className="mb-4 flex justify-center">
            <AvatarUploader currentAvatarUrl={profile?.avatar_url} username={profile?.username} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-1">{profile?.username}</h1>
        <p className="text-gray-500 text-sm mb-6">{user.email}</p>
      </div>

      <h2 className="w-full text-left text-lg font-bold text-gray-400 mb-4 border-b border-gray-100 pb-2">
        Your Posts
      </h2>

      <div className="w-full space-y-4">
        {posts?.map((post) => {
          const likes = post.likes || [];
          const likeCount = likes.length;
          const isLiked = likes.some((like: any) => like.user_id === user.id);
          // マイページは自分の投稿しかないので常にtrueですが、一応判定式にしておきます
          const isOwnPost = post.user_id === user.id;

          return (
            <div key={post.id} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-place-light transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <UserAvatar src={post.profiles?.avatar_url} username={post.profiles?.username} />
                <div>
                  <div className="font-bold text-gray-900">{post.profiles?.username}</div>
                  <div className="text-xs text-gray-400">{new Date(post.created_at).toLocaleString('ja-JP')}</div>
                </div>
              </div>

              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-lg mb-4">
                {post.content}
              </p>
              
              {/* フッター部分 */}
              <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                <div className="flex items-center space-x-6">
                  <LikeButton postId={post.id} initialCount={likeCount} initialIsLiked={isLiked} />
                </div>
                
                {/* ★ 削除ボタン */}
                {isOwnPost && <DeletePostButton postId={post.id} />}
              </div>
            </div>
          );
        })}

        {posts?.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            まだ投稿がありません。
          </div>
        )}
      </div>
    </main>
  );
}