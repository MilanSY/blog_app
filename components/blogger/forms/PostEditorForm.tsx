"use client";

import { useActionState, useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { EditPostState } from "@/app/actions/postEdit";
import ImageFileInput from "@/components/blogger/forms/ImageFileInput";
import WysiwygEditor from "@/components/blogger/forms/WysiwygEditor";

type PostEditorFormProps = {
  action: (prevState: EditPostState, formData: FormData) => Promise<EditPostState>;
  submitLabel: string;
  postId?: string;
  enableCoverFile?: boolean;
  initialValues?: {
    title?: string;
    contentHtml?: string;
    coverImageUrl?: string;
    isVisible?: boolean;
  };
};

const INITIAL_STATE: EditPostState = {
  status: "idle",
  message: "",
};

export default function PostEditorForm({
  action,
  submitLabel,
  postId,
  enableCoverFile = false,
  initialValues,
}: PostEditorFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);
  const [contentHtml, setContentHtml] = useState(initialValues?.contentHtml ?? "");

  useEffect(() => {
    if (state.status === "success" && state.redirectTo) {
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [router, state.redirectTo, state.status]);

  return (
    <form action={formAction} encType="multipart/form-data" className="mt-6 space-y-4">
      {postId ? <input type="hidden" name="post_id" value={postId} /> : null}
      <input type="hidden" name="content_html" value={contentHtml} />

      {state.status !== "idle" ? (
        <p
          className={`rounded-md border px-3 py-2 text-sm ${
            state.status === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <label className="block text-sm">
        <span>Title</span>
        <input
          name="title"
          type="text"
          required
          defaultValue={initialValues?.title ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </label>

      <label className="block text-sm">
        <span>Content</span>
        <WysiwygEditor initialHtml={initialValues?.contentHtml ?? ""} onChange={setContentHtml} />
      </label>

      {enableCoverFile ? (
        <ImageFileInput
          name="cover_file"
          label="Cover image file"
          helperText="PNG, JPG, WEBP or GIF - max 5MB"
          currentImageUrl={initialValues?.coverImageUrl || undefined}
        />
      ) : null}

      <label className="flex items-center gap-2 text-sm">
        <input
          name="is_visible"
          type="checkbox"
          defaultChecked={initialValues?.isVisible ?? true}
          className="h-4 w-4"
        />
        <span>Visible</span>
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-60"
      >
        {isPending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
