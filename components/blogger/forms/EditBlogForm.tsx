"use client";

import { useActionState } from "react";
import { updateMyBlogAction, type EditBlogState } from "@/app/actions/blogEdit";
import ImageFileInput from "@/components/blogger/forms/ImageFileInput";

type EditBlogFormProps = {
  initialBio: string;
  initialAvatarUrl: string;
  initialInterests: string;
};

const INITIAL_STATE: EditBlogState = {
  status: "idle",
  message: "",
};

export default function EditBlogForm({
  initialBio,
  initialAvatarUrl,
  initialInterests,
}: EditBlogFormProps) {
  const [state, formAction, isPending] = useActionState(updateMyBlogAction, INITIAL_STATE);

  return (
    <form action={formAction} className="mt-6 space-y-4">
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
        <span>Bio</span>
        <textarea
          name="bio"
          defaultValue={initialBio}
          rows={5}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </label>

      <ImageFileInput
        name="avatar_file"
        label="Avatar image"
        helperText="PNG, JPG, WEBP or GIF - max 5MB"
        currentImageUrl={initialAvatarUrl || undefined}
      />

      <label className="block text-sm">
        <span>Interests (comma separated)</span>
        <input
          name="interests"
          type="text"
          defaultValue={initialInterests}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
