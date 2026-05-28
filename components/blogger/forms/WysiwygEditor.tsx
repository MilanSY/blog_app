"use client";

import { useEffect, useRef } from "react";

type WysiwygEditorProps = {
  initialHtml: string;
  onChange: (html: string) => void;
};

export default function WysiwygEditor({ initialHtml, onChange }: WysiwygEditorProps) {
  const editorRootRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<import("quill").default | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initEditor() {
      if (!editorRootRef.current || quillRef.current) {
        return;
      }

      const Quill = (await import("quill")).default;
      if (!mounted || !editorRootRef.current) {
        return;
      }

      const quill = new Quill(editorRootRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "strike"],
            [{ header: 2 }],
            [{ list: "bullet" }],
            ["clean"],
          ],
        },
      });

      quill.root.innerHTML = initialHtml;
      onChange(quill.root.innerHTML);

      quill.on("text-change", () => {
        onChange(quill.root.innerHTML);
      });

      quillRef.current = quill;
    }

    initEditor();

    return () => {
      mounted = false;
      quillRef.current = null;
    };
  }, [initialHtml, onChange]);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) {
      return;
    }

    if (quill.root.innerHTML !== initialHtml) {
      quill.root.innerHTML = initialHtml;
    }
  }, [initialHtml]);

  return (
    <div className="mt-1 rounded-md border border-gray-300 bg-white p-2">
      <div ref={editorRootRef} className="min-h-56" />
    </div>
  );
}
