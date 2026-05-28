import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

type BlogRow = Database["public"]["Tables"]["blogs"]["Row"];
type PostRow = Database["public"]["Tables"]["posts"]["Row"];

export type PublicBlogPost = Pick<
  PostRow,
  "id" | "slug" | "title" | "published_at"
>;

export type PublicBlogPageData = {
  blog: Pick<BlogRow, "id" | "pseudo" | "bio" | "avatar_url" | "interests">;
  posts: PublicBlogPost[];
};

export type PublicBlogListItem = Pick<
  BlogRow,
  "id" | "pseudo" | "bio" | "avatar_url" | "interests"
> & {
  latestPublishedAt: string | null;
};

export type PublicPostPageData = {
  blog: Pick<BlogRow, "id" | "pseudo" | "bio" | "avatar_url" | "interests">;
  post: Pick<PostRow, "id" | "title" | "content_html" | "cover_image_url" | "published_at">;
};

export async function getPublicBlogByPseudo(
  pseudo: string,
): Promise<PublicBlogPageData | null> {
  const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey);

  const { data: blog, error: blogError } = await supabase
    .from("blogs")
    .select("id, pseudo, bio, avatar_url, interests")
    .eq("pseudo", pseudo)
    .eq("is_visible", true)
    .maybeSingle();

  if (blogError || !blog) {
    return null;
  }

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("id, slug, title, published_at")
    .eq("blog_id", blog.id)
    .eq("is_visible", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("title", { ascending: true });

  if (postsError) {
    return null;
  }

  return {
    blog,
    posts: posts ?? [],
  };
}

export async function getVisibleBlogsNewestFirst(): Promise<PublicBlogListItem[]> {
  const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey);

  const { data: blogs, error: blogsError } = await supabase
    .from("blogs")
    .select("id, pseudo, bio, avatar_url, interests")
    .eq("is_visible", true);

  if (blogsError || !blogs || blogs.length === 0) {
    return [];
  }

  const blogIds = blogs.map((blog) => blog.id);

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("blog_id, published_at")
    .in("blog_id", blogIds)
    .eq("is_visible", true)
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  if (postsError) {
    return [];
  }

  const latestPublishedByBlog = new Map<string, string>();

  for (const post of posts ?? []) {
    if (!latestPublishedByBlog.has(post.blog_id) && post.published_at) {
      latestPublishedByBlog.set(post.blog_id, post.published_at);
    }
  }

  return blogs
    .map((blog) => ({
      ...blog,
      latestPublishedAt: latestPublishedByBlog.get(blog.id) ?? null,
    }))
    .sort((a, b) => {
      const aTs = a.latestPublishedAt ? new Date(a.latestPublishedAt).getTime() : -1;
      const bTs = b.latestPublishedAt ? new Date(b.latestPublishedAt).getTime() : -1;

      if (aTs === bTs) {
        return a.pseudo.localeCompare(b.pseudo);
      }

      return bTs - aTs;
    });
}

export async function getPublicPostById(
  pseudo: string,
  postId: string,
): Promise<PublicPostPageData | null> {
  const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey);

  const { data: blog, error: blogError } = await supabase
    .from("blogs")
    .select("id, pseudo, bio, avatar_url, interests")
    .eq("pseudo", pseudo)
    .eq("is_visible", true)
    .maybeSingle();

  if (blogError || !blog) {
    return null;
  }

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("id, title, content_html, cover_image_url, published_at")
    .eq("blog_id", blog.id)
    .eq("id", postId)
    .eq("is_visible", true)
    .maybeSingle();

  if (postError || !post) {
    return null;
  }

  return {
    blog,
    post,
  };
}
