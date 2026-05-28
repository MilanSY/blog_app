"use server";

import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { getSession } from "@/lib/auth/session";
import type { Database } from "@/lib/supabase/database.types";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

export type EditPostState = {
  status: "idle" | "success" | "error";
  message: string;
  redirectTo?: string;
};

function getSupabase() {
  return createClient<Database>(supabaseUrl, supabasePublishableKey);
}

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

function getImageExtension(file: File) {
  const extFromName = path.extname(file.name).toLowerCase();

  if ([".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(extFromName)) {
    return extFromName;
  }

  if (file.type === "image/png") return ".png";
  if (file.type === "image/jpeg") return ".jpg";
  if (file.type === "image/webp") return ".webp";
  if (file.type === "image/gif") return ".gif";

  return null;
}

async function uploadCoverFile(file: File, userId: string) {
  if (file.size === 0) {
    return { error: null, coverImageUrl: null } as const;
  }

  if (!file.type.startsWith("image/")) {
    return { error: "Cover must be an image.", coverImageUrl: null } as const;
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { error: "Cover is too large (max 5MB).", coverImageUrl: null } as const;
  }

  const extension = getImageExtension(file);

  if (!extension) {
    return { error: "Unsupported cover image format.", coverImageUrl: null } as const;
  }

  const fileName = `${userId}-${Date.now()}${extension}`;
  const directory = path.join(process.cwd(), "public", "img", "posts");
  const filePath = path.join(directory, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await mkdir(directory, { recursive: true });
  await writeFile(filePath, buffer);

  return { error: null, coverImageUrl: `/img/posts/${fileName}` } as const;
}

async function getCurrentBloggerBlog() {
  const session = await getSession();

  if (!session || session.role !== "blogger") {
    return { error: "Unauthorized.", blog: null } as const;
  }

  const supabase = getSupabase();
  const { data: blog, error } = await supabase
    .from("blogs")
    .select("id, pseudo")
    .eq("user_id", session.userId)
    .maybeSingle();

  if (error || !blog) {
    return { error: "Blog not found.", blog: null } as const;
  }

  return { error: null, blog } as const;
}

function parsePostFormData(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const contentHtml = String(formData.get("content_html") ?? "").trim();
  const isVisible = String(formData.get("is_visible") ?? "") === "on";

  return {
    title,
    contentHtml,
    isVisible,
  };
}

function toSlugBase(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

function createSlugFromTitle(title: string) {
  return toSlugBase(title) || "post";
}

async function createUniqueSlug(
  supabase: ReturnType<typeof getSupabase>,
  title: string,
) {
  const base = createSlugFromTitle(title);
  let candidate = base;

  for (let i = 2; i <= 100; i += 1) {
    const { data: existing, error } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) {
      return { error: "Failed to generate post slug.", slug: null } as const;
    }

    if (!existing) {
      return { error: null, slug: candidate } as const;
    }

    candidate = `${base}-${i}`;
  }

  return { error: "Could not generate a unique slug.", slug: null } as const;
}

function htmlHasText(value: string) {
  const stripped = value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();
  return stripped.length > 0;
}

export async function createPostAction(
  _prevState: EditPostState,
  formData: FormData,
): Promise<EditPostState> {
  const context = await getCurrentBloggerBlog();

  if (context.error || !context.blog) {
    return { status: "error", message: context.error ?? "Unauthorized." };
  }

  const data = parsePostFormData(formData);
  const coverFile = formData.get("cover_file");

  if (!data.title || !data.contentHtml || !htmlHasText(data.contentHtml)) {
    return { status: "error", message: "Title and content are required." };
  }

  let nextCoverImageUrl = null;

  if (coverFile instanceof File && coverFile.size > 0) {
    const uploaded = await uploadCoverFile(coverFile, context.blog.id);

    if (uploaded.error) {
      return { status: "error", message: uploaded.error };
    }

    nextCoverImageUrl = uploaded.coverImageUrl;
  }

  const supabase = getSupabase();
  const uniqueSlug = await createUniqueSlug(supabase, data.title);

  if (uniqueSlug.error || !uniqueSlug.slug) {
    return { status: "error", message: uniqueSlug.error ?? "Invalid slug." };
  }

  const { data: createdPost, error } = await supabase
    .from("posts")
    .insert({
      blog_id: context.blog.id,
      title: data.title,
      slug: uniqueSlug.slug,
      content_html: data.contentHtml,
      cover_image_url: nextCoverImageUrl,
      published_at: new Date().toISOString(),
      is_visible: data.isVisible,
    })
    .select("id")
    .single();

  if (error) {
    return { status: "error", message: error.message || "Failed to create post." };
  }

  revalidatePath(`/blog/${context.blog.pseudo}`);
  revalidatePath("/blog/edit");
  revalidatePath("/");

  return {
    status: "success",
    message: "Post created.",
    redirectTo: `/blog/${context.blog.pseudo}/${createdPost.id}`,
  };
}

export async function updatePostAction(
  _prevState: EditPostState,
  formData: FormData,
): Promise<EditPostState> {
  const context = await getCurrentBloggerBlog();

  if (context.error || !context.blog) {
    return { status: "error", message: context.error ?? "Unauthorized." };
  }

  const postId = String(formData.get("post_id") ?? "").trim();

  if (!postId) {
    return { status: "error", message: "Missing post id." };
  }

  const data = parsePostFormData(formData);
  const coverFile = formData.get("cover_file");

  if (!data.title || !data.contentHtml || !htmlHasText(data.contentHtml)) {
    return { status: "error", message: "Title and content are required." };
  }

  const supabase = getSupabase();

  const { data: ownedPost, error: ownedPostError } = await supabase
    .from("posts")
    .select("id, cover_image_url")
    .eq("id", postId)
    .eq("blog_id", context.blog.id)
    .maybeSingle();

  if (ownedPostError || !ownedPost) {
    return { status: "error", message: "Post not found." };
  }

  let nextCoverImageUrl = ownedPost.cover_image_url;

  if (coverFile instanceof File && coverFile.size > 0) {
    const uploaded = await uploadCoverFile(coverFile, context.blog.id);

    if (uploaded.error) {
      return { status: "error", message: uploaded.error };
    }

    nextCoverImageUrl = uploaded.coverImageUrl;
  }

  const { error } = await supabase
    .from("posts")
    .update({
      title: data.title,
      content_html: data.contentHtml,
      cover_image_url: nextCoverImageUrl,
      is_visible: data.isVisible,
    })
    .eq("id", postId)
    .eq("blog_id", context.blog.id);

  if (error) {
    return { status: "error", message: error.message || "Failed to update post." };
  }

  revalidatePath(`/blog/${context.blog.pseudo}`);
  revalidatePath(`/blog/${context.blog.pseudo}/${postId}`);
  revalidatePath("/blog/edit");
  revalidatePath("/");

  return { status: "success", message: "Post updated." };
}

export async function deletePostAction(formData: FormData): Promise<void> {
  const context = await getCurrentBloggerBlog();

  if (context.error || !context.blog) {
    return;
  }

  const postId = String(formData.get("post_id") ?? "").trim();

  if (!postId) {
    return;
  }

  const supabase = getSupabase();

  await supabase.from("posts").delete().eq("id", postId).eq("blog_id", context.blog.id);

  revalidatePath(`/blog/${context.blog.pseudo}`);
  revalidatePath("/blog/edit");
  revalidatePath("/");
}
