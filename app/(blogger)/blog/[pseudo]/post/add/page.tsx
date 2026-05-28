import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { createPostAction } from "@/app/actions/postEdit";
import PostEditorForm from "@/components/blogger/forms/PostEditorForm";
import { getSession } from "@/lib/auth/session";
import type { Database } from "@/lib/supabase/database.types";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

type AddPostPageProps = {
  params: Promise<{
    pseudo: string;
  }>;
};

function getSupabase() {
  return createClient<Database>(supabaseUrl, supabasePublishableKey);
}

export default async function AddPostPage({ params }: AddPostPageProps) {
  const session = await getSession();

  if (!session || session.role !== "blogger") {
    redirect("/login");
  }

  const { pseudo } = await params;
  const supabase = getSupabase();

  const { data: blog, error } = await supabase
    .from("blogs")
    .select("pseudo")
    .eq("user_id", session.userId)
    .maybeSingle();

  if (error || !blog) {
    notFound();
  }

  if (blog.pseudo !== pseudo) {
    redirect(`/blog/${blog.pseudo}/post/add`);
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Add post</h1>
        <Link href="/blog/edit" className="text-sm underline">
          Back to blog edit
        </Link>
      </div>
      <p className="mt-2 text-sm text-gray-600">Pseudo: {blog.pseudo}</p>

      <PostEditorForm action={createPostAction} submitLabel="Create post" enableCoverFile />
    </main>
  );
}
