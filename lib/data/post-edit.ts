import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

type BloggerBlogIdentity = Pick<Database["public"]["Tables"]["blogs"]["Row"], "id" | "pseudo">;
type EditablePost = Pick<
  Database["public"]["Tables"]["posts"]["Row"],
  "id" | "title" | "content_html" | "cover_image_url" | "is_visible"
>;

export type PostEditData = {
  blog: BloggerBlogIdentity | null;
  post: EditablePost | null;
};

export async function getMyBlogAndOwnedPostForEdit(
  userId: string,
  postId: string,
): Promise<PostEditData> {
  const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey);

  const { data: blog, error: blogError } = await supabase
    .from("blogs")
    .select("id, pseudo")
    .eq("user_id", userId)
    .maybeSingle();

  if (blogError || !blog) {
    return { blog: null, post: null };
  }

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("id, title, content_html, cover_image_url, is_visible")
    .eq("id", postId)
    .eq("blog_id", blog.id)
    .maybeSingle();

  if (postError || !post) {
    return { blog, post: null };
  }

  return { blog, post };
}
