import { redirect } from "next/navigation";
import { updateAboutAction } from "@/app/actions/admin";
import AboutEditorForm from "@/components/admin/forms/AboutEditorForm";
import { getAboutContent } from "@/lib/data/about";
import { getSession } from "@/lib/auth/session";

export default async function AdminAboutEditPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "admin") {
    redirect("/");
  }

  const about = await getAboutContent();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Admin - Edit About</h1>
      <p className="mt-2 text-sm text-gray-600">Manage the public About page content.</p>

      <AboutEditorForm
        action={updateAboutAction}
        initialValues={{
          title: about?.title ?? "About",
          contentHtml: about?.contentHtml ?? "",
        }}
      />
    </main>
  );
}
