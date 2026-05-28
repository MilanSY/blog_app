"use client";

import Image from "next/image";
import { useEffect, useState, type ChangeEvent } from "react";

type ImageFileInputProps = {
  name: string;
  label: string;
  helperText: string;
  currentImageUrl?: string;
  emptyText?: string;
};

export default function ImageFileInput({
  name,
  label,
  helperText,
  currentImageUrl,
  emptyText = "Current: empty",
}: ImageFileInputProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!file) {
      setPreviewUrl(null);
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
  }

  const displayImageUrl = previewUrl ?? currentImageUrl;

  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      <div className="mt-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
        <input
          name={name}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="block w-full cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        />
        <p className="mt-2 text-xs text-gray-600">{helperText}</p>
        {displayImageUrl ? (
          <div className="mt-3 flex items-center gap-3 rounded-md border border-gray-200 bg-white p-2">
            <Image
              src={displayImageUrl}
              alt={label}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
            <p className="text-xs text-gray-600">{previewUrl ? "Preview image" : "Current image"}</p>
          </div>
        ) : (
          <p className="mt-3 text-xs text-gray-600">{emptyText}</p>
        )}
      </div>
    </label>
  );
}
