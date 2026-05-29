import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

type BloggerBlogIdentity = Pick<Database["public"]["Tables"]["blogs"]["Row"], "pseudo">;

export async function getMyBlogForAddPost(userId: string): Promise<BloggerBlogIdentity | null> {
  const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey);

  const { data: blog, error } = await supabase
    .from("blogs")
    .select("pseudo")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !blog) {
    return null;
  }

  return blog;
}
