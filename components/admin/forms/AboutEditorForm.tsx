"use client";

import { useActionState, useState } from "react";
import type { AdminActionState } from "@/app/actions/admin";
import WysiwygEditor from "@/components/blogger/forms/WysiwygEditor";

type AboutEditorFormProps = {
  action: (prevState: AdminActionState, formData: FormData) => Promise<AdminActionState>;
  initialValues: {
    title: string;
    contentHtml: string;
  };
};

const INITIAL_STATE: AdminActionState = {
  status: "idle",
  message: "",
};

export default function AboutEditorForm({ action, initialValues }: AboutEditorFormProps) {
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);
  const [contentHtml, setContentHtml] = useState(initialValues.contentHtml);

  return (
    <form action={formAction} className="mt-6 space-y-4">
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
          defaultValue={initialValues.title}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </label>

      <label className="block text-sm">
        <span>Content</span>
        <WysiwygEditor initialHtml={initialValues.contentHtml} onChange={setContentHtml} />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save About"}
      </button>
    </form>
  );
}
