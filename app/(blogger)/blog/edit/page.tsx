import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import EditBlogForm from "@/components/blogger/forms/EditBlogForm";
import PostCardsGrid from "@/components/blogger/posts/PostCardsGrid";
import { getSession } from "@/lib/auth/session";
import type { Database } from "@/lib/supabase/database.types";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

function getSupabase() {
  return createClient<Database>(supabaseUrl, supabasePublishableKey);
}

export default async function EditBlogPage() {
  const session = await getSession();

  if (!session || session.role !== "blogger") {
    redirect("/login");
  }

  const supabase = getSupabase();
  const { data: blog, error } = await supabase
    .from("blogs")
    .select("id, pseudo, bio, avatar_url, interests")
    .eq("user_id", session.userId)
    .maybeSingle();

  if (error || !blog) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-semibold">Edit blog</h1>
        <p className="mt-4 text-sm text-gray-600">empty</p>
      </main>
    );
  }

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("id, title, slug, published_at, is_visible")
    .eq("blog_id", blog.id)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("title", { ascending: true });

  if (postsError) {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-semibold">Edit blog</h1>
        <p className="mt-4 text-sm text-gray-600">Unable to load posts.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Edit blog</h1>
      <p className="mt-2 text-sm text-gray-600">Pseudo: {blog.pseudo}</p>
      <EditBlogForm
        initialBio={blog.bio ?? ""}
        initialAvatarUrl={blog.avatar_url ?? ""}
        initialInterests={blog.interests?.join(", ") ?? ""}
      />

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Your posts</h2>
        <PostCardsGrid pseudo={blog.pseudo} posts={posts ?? []} />
      </section>
    </main>
  );
}
