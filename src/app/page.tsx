import { createClient } from "@/utils/supabase/server";
import PostForm from "@/components/PostForm";
import LikeButton from "@/components/LikeButton";
import { Heart } from "lucide-react";
import UserAvatar from "@/components/UserAvatar"; 
import DeletePostButton from "@/components/DeletePostButton"; // 追加

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: posts } = await supabase
    .from("posts")
    .select(`
      *,
      profiles (username, avatar_url), 
      likes (user_id)
    `)
    .order("created_at", { ascending: false });

  return (
    <main className="flex min-h-screen flex-col items-center pt-10 pb-20 px-4 max-w-2xl mx-auto">
      {/* ...ロゴやフォーム部分はそのまま... */}
      <div className="w-full text-center mb-10">
        <h1 className="text-6xl font-black tracking-tighter text-place-blue mb-2">Place</h1>
        <p className="text-despair-500 font-medium">Brilliance for all.</p>
      </div>

      {user ? (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
           <PostForm />
        </div>
      ) : (
        <div className="mb-8 text-center p-6 bg-gray-50 rounded-xl">
          <p className="text-gray-500 mb-2">投稿するにはログインが必要です</p>
          <a href="/login" className="text-place-blue font-bold hover:underline">ログインページへ</a>
        </div>
      )}

      {/* タイムライン */}
      <div className="w-full space-y-4">
        {posts?.map((post) => {
          const likes = post.likes || [];
          const likeCount = likes.length;
          const isLiked = user ? likes.some((like: any) => like.user_id === user.id) : false;
          
          // ★ 自分の投稿かどうか判定
          const isOwnPost = user && post.user_id === user.id;

          return (
            <div key={post.id} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-place-light transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                 <UserAvatar src={post.profiles?.avatar_url} username={post.profiles?.username} />
                <div>
                  <div className="font-bold text-gray-900">{post.profiles?.username || "Unknown User"}</div>
                  <div className="text-xs text-gray-400">{new Date(post.created_at).toLocaleString('ja-JP')}</div>
                </div>
              </div>

              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-lg mb-4">
                {post.content}
              </p>
              
              {/* フッター部分を Flexbox で左右配置に変更 */}
              <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                <div className="flex items-center space-x-6">
                  {user ? (
                    <LikeButton postId={post.id} initialCount={likeCount} initialIsLiked={isLiked} />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <div className="p-2"><Heart className="w-5 h-5" /></div>
                      <span className="text-sm">{likeCount > 0 ? likeCount : ""}</span>
                    </div>
                  )}
                </div>

                {/* ★ 自分の投稿ならゴミ箱を表示 */}
                {isOwnPost && <DeletePostButton postId={post.id} />}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}