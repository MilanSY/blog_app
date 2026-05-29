import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getSession } from "@/lib/auth/session";
import type { Database } from "@/lib/supabase/database.types";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "My blog | Blog App",
  description: "Open your public blog page.",
};

function getSupabase() {
  return createClient<Database>(supabaseUrl, supabasePublishableKey);
}

export default async function BlogRootPage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const supabase = getSupabase();
  const { data: blog } = await supabase
    .from("blogs")
    .select("pseudo")
    .eq("user_id", session.userId)
    .maybeSingle();

  if (!blog) {
    redirect("/");
  }

  redirect(`/blog/${blog.pseudo}`);
}
