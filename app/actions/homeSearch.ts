"use server";

import { redirect } from "next/navigation";

export async function searchBlogsAction(formData: FormData) {
  const query = String(formData.get("q") ?? "").trim();

  if (!query) {
    redirect("/");
  }

  redirect(`/?q=${encodeURIComponent(query)}`);
}
