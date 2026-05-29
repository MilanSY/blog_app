import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

type ModerationBlog = Pick<Database["public"]["Tables"]["blogs"]["Row"], "id" | "pseudo" | "is_visible">;
type ModerationPost = {
  id: string;
  title: string;
  is_visible: boolean;
  blog_id: string;
  blogs: {
    pseudo: string;
  };
};

export type ModerationData = {
  blogs: ModerationBlog[];
  posts: ModerationPost[];
};

export async function getModerationData(): Promise<ModerationData> {
  const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey);

  const [{ data: blogs }, { data: posts }] = await Promise.all([
    supabase.from("blogs").select("id, pseudo, is_visible").order("pseudo", { ascending: true }),
    supabase
      .from("posts")
      .select("id, title, is_visible, blog_id, blogs!inner(pseudo)")
      .order("title", { ascending: true }),
  ]);

  return {
    blogs: blogs ?? [],
    posts: (posts ?? []) as ModerationPost[],
  };
}
