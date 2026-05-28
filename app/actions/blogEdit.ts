"use server";

import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { getSession } from "@/lib/auth/session";
import type { Database } from "@/lib/supabase/database.types";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";
import { redirect } from "next/navigation";

export type EditBlogState = {
  status: "idle" | "success" | "error";
  message: string;
};

function getSupabase() {
  return createClient<Database>(supabaseUrl, supabasePublishableKey);
}

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;

function getAvatarExtension(file: File) {
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

export async function updateMyBlogAction(
  _prevState: EditBlogState,
  formData: FormData,
): Promise<EditBlogState> {
  const session = await getSession();

  if (!session || session.role !== "blogger") {
    return { status: "error", message: "Unauthorized." };
  }

  const bio = String(formData.get("bio") ?? "").trim();
  const interestsRaw = String(formData.get("interests") ?? "").trim();
  const avatarFile = formData.get("avatar_file");

  const interests = interestsRaw
    ? interestsRaw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : null;

  const supabase = getSupabase();

  const { data: blog, error: blogError } = await supabase
    .from("blogs")
    .select("pseudo, avatar_url")
    .eq("user_id", session.userId)
    .maybeSingle();

  if (blogError || !blog) {
    return { status: "error", message: blogError?.message || "Blog not found." };
  }

  let nextAvatarUrl = blog.avatar_url;

  if (avatarFile instanceof File && avatarFile.size > 0) {
    if (!avatarFile.type.startsWith("image/")) {
      return { status: "error", message: "Avatar must be an image." };
    }

    if (avatarFile.size > MAX_AVATAR_SIZE_BYTES) {
      return { status: "error", message: "Avatar is too large (max 5MB)." };
    }

    const extension = getAvatarExtension(avatarFile);

    if (!extension) {
      return { status: "error", message: "Unsupported image format." };
    }

    const fileName = `${session.userId}-${Date.now()}${extension}`;
      const avatarDirectory = path.join(process.cwd(), "public", "img", "avatars");
      const avatarFilePath = path.join(avatarDirectory, fileName);
    const avatarBuffer = Buffer.from(await avatarFile.arrayBuffer());

    await mkdir(avatarDirectory, { recursive: true });
    await writeFile(avatarFilePath, avatarBuffer);

      nextAvatarUrl = `/img/avatars/${fileName}`;
  }

  const { error: updateError } = await supabase
    .from("blogs")
    .update({
      bio: bio || null,
      avatar_url: nextAvatarUrl,
      interests,
    })
    .eq("user_id", session.userId);

  if (updateError) {
    return { status: "error", message: "Update failed." };
  }

  revalidatePath(`/blog/${blog.pseudo}`);
  revalidatePath("/");

  redirect("/blog");
}
