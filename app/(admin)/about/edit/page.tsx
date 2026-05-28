import { notFound, redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { updateAboutAction } from "@/app/actions/admin";
import AboutEditorForm from "@/components/admin/forms/AboutEditorForm";
import { getSession } from "@/lib/auth/session";
import type { Database } from "@/lib/supabase/database.types";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

function getSupabase() {
  return createClient<Database>(supabaseUrl, supabasePublishableKey);
}

export default async function AdminAboutEditPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "admin") {
    redirect("/");
  }

  const supabase = getSupabase();
  const { data: about, error } = await supabase
    .from("about")
    .select("title, content_html, is_visible")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Admin - Edit About</h1>
      <p className="mt-2 text-sm text-gray-600">Manage the public About page content.</p>

      <AboutEditorForm
        action={updateAboutAction}
        initialValues={{
          title: about?.title ?? "About",
          contentHtml: about?.content_html ?? "",
          isVisible: about?.is_visible ?? true,
        }}
      />
    </main>
  );
}
