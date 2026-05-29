import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

type EditBlogRow = Pick<
  Database["public"]["Tables"]["blogs"]["Row"],
  "id" | "pseudo" | "bio" | "avatar_url" | "interests"
>;

type EditPostRow = Pick<
  Database["public"]["Tables"]["posts"]["Row"],
  "id" | "title" | "slug" | "published_at" | "is_visible"
>;

export type BlogEditData = {
  blog: EditBlogRow | null;
  posts: EditPostRow[];
  postsError: boolean;
};

export async function getMyBlogForEdit(userId: string): Promise<BlogEditData> {
  const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey);
  const { data: blog, error } = await supabase
    .from("blogs")
    .select("id, pseudo, bio, avatar_url, interests")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !blog) {
    return { blog: null, posts: [], postsError: false };
  }

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("id, title, slug, published_at, is_visible")
    .eq("blog_id", blog.id)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("title", { ascending: true });

  return {
    blog,
    posts: posts ?? [],
    postsError: Boolean(postsError),
  };
}
