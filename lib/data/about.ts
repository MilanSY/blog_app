import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

export type AboutContent = {
  title: string;
  contentHtml: string;
};

export async function getVisibleAbout(): Promise<AboutContent | null> {
  const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey);

  const { data, error } = await supabase
    .from("about")
    .select("title, content_html")
    .eq("id", 1)
    .eq("is_visible", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    title: data.title,
    contentHtml: data.content_html,
  };
}
