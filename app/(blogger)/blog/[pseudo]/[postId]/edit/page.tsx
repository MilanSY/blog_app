import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { updatePostAction } from "@/app/actions/postEdit";
import PostEditorForm from "@/components/blogger/forms/PostEditorForm";
import { getSession } from "@/lib/auth/session";
import type { Database } from "@/lib/supabase/database.types";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

type EditPostPageProps = {
  params: Promise<{
    pseudo: string;
    postId: string;
  }>;
};

function getSupabase() {
  return createClient<Database>(supabaseUrl, supabasePublishableKey);
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const session = await getSession();

  if (!session || session.role !== "blogger") {
    redirect("/login");
  }

  const { pseudo, postId } = await params;
  const supabase = getSupabase();

  const { data: blog, error: blogError } = await supabase
    .from("blogs")
    .select("id, pseudo")
    .eq("user_id", session.userId)
    .maybeSingle();

  if (blogError || !blog) {
    notFound();
  }

  if (blog.pseudo !== pseudo) {
    redirect(`/blog/${blog.pseudo}/${postId}/edit`);
  }

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("id, title, content_html, cover_image_url, is_visible")
    .eq("id", postId)
    .eq("blog_id", blog.id)
    .maybeSingle();

  if (postError || !post) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Edit post</h1>
        <Link href="/blog/edit" className="text-sm underline">
          Back to blog edit
        </Link>
      </div>
      <p className="mt-2 text-sm text-gray-600">Pseudo: {blog.pseudo}</p>

      <PostEditorForm
        action={updatePostAction}
        submitLabel="Update post"
        postId={post.id}
        enableCoverFile
        initialValues={{
          title: post.title,
          contentHtml: post.content_html,
          coverImageUrl: post.cover_image_url ?? "",
          isVisible: post.is_visible,
        }}
      />
    </main>
  );
}
