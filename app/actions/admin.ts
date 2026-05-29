"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { getSession } from "@/lib/auth/session";
import type { Database } from "@/lib/supabase/database.types";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

export type AdminActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

function getSupabase() {
  return createClient<Database>(supabaseUrl, supabasePublishableKey);
}

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return null;
  }

  return session;
}

export async function updateAboutAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requireAdmin();
  if (!session) {
    return { status: "error", message: "Unauthorized." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const contentHtml = String(formData.get("content_html") ?? "").trim();

  if (!title || !contentHtml) {
    return { status: "error", message: "Title and content are required." };
  }

  const supabase = getSupabase();
  const { error } = await supabase.from("about").upsert(
    {
      id: 1,
      title,
      content_html: contentHtml,
    },
    { onConflict: "id" },
  );

  if (error) {
    return { status: "error", message: error.message || "Failed to update About." };
  }

  revalidatePath("/about");
  revalidatePath("/admin/about/edit");
  updateTag("about");

  return { status: "success", message: "About page updated." };
}

export async function toggleBlogVisibilityAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  if (!session) {
    return;
  }

  const blogId = String(formData.get("blog_id") ?? "").trim();
  const nextVisible = String(formData.get("next_visible") ?? "") === "true";

  if (!blogId) {
    return;
  }

  const supabase = getSupabase();
  const { data } = await supabase
    .from("blogs")
    .update({ is_visible: nextVisible })
    .eq("id", blogId)
    .select("pseudo")
    .maybeSingle();

  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath("/admin/moderation");

  if (data?.pseudo) {
    revalidatePath(`/blog/${data.pseudo}`);
  }
}

export async function togglePostVisibilityAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  if (!session) {
    return;
  }

  const postId = String(formData.get("post_id") ?? "").trim();
  const nextVisible = String(formData.get("next_visible") ?? "") === "true";

  if (!postId) {
    return;
  }

  const supabase = getSupabase();
  const { data } = await supabase
    .from("posts")
    .update({ is_visible: nextVisible })
    .eq("id", postId)
    .select("id, blog_id, blogs!inner(pseudo)")
    .maybeSingle();

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/moderation");

  const pseudo = data?.blogs?.pseudo;
  if (pseudo) {
    revalidatePath(`/blog/${pseudo}`);
    revalidatePath(`/blog/${pseudo}/${data.id}`);
  }
}
