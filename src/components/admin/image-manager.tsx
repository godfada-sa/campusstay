"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Photo = { url: string; alt: string };

export function ImageManager({ initial }: { initial: Photo[] }) {
  const [photos, setPhotos] = useState<Photo[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(files: FileList) {
    setUploading(true);
    setError(null);

    for (const file of Array.from(files)) {
      const body = new FormData();
      body.append("file", file);

      try {
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body,
        });
        const json = (await response.json()) as { url?: string; error?: string };

        if (!response.ok || !json.url) {
          setError(json.error ?? "Upload failed. Try a smaller file.");
          break;
        }

        setPhotos((current) => [...current, { url: json.url!, alt: "" }]);
      } catch {
        setError("Check your connection and try the upload again.");
        break;
      }
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(index: number) {
    setPhotos((current) => current.filter((_, i) => i !== index));
  }

  function setAlt(index: number, alt: string) {
    setPhotos((current) =>
      current.map((photo, i) => (i === index ? { ...photo, alt } : photo)),
    );
  }

  return (
    <div>
      <input type="hidden" name="images" value={JSON.stringify(photos)} />

      <div className="flex flex-wrap items-center gap-3">
        <label className="btn btn-outline cursor-pointer">
          {uploading ? "Uploading…" : "Upload photos"}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            disabled={uploading}
            onChange={(event) => {
              if (event.target.files?.length) upload(event.target.files);
            }}
          />
        </label>
        <p className="text-xs text-muted">JPG, PNG or WebP. Up to 4 MB each.</p>
      </div>

      {error ? (
        <p className="mt-3 border border-[#d9b4a6] bg-[#f8eae4] px-3 py-2 text-sm text-[#7e2f13]">
          {error}
        </p>
      ) : null}

      {photos.length === 0 ? (
        <p className="mt-4 border border-dashed border-line px-4 py-8 text-center text-sm text-muted">
          No photos yet. Upload at least one photo before publishing.
        </p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {photos.map((photo, index) => (
            <li key={`${photo.url}-${index}`} className="flex gap-3 border border-line p-2">
              <div className="relative h-20 w-24 shrink-0 overflow-hidden bg-paper-deep">
                <Image
                  src={photo.url}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
                  Photo {index + 1}
                </p>
                <input
                  value={photo.alt}
                  onChange={(event) => setAlt(index, event.target.value)}
                  placeholder="Describe the photo"
                  className="input mt-1 !min-h-9 !py-1.5 text-sm"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-1 text-xs text-[#8c3416] underline underline-offset-2"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
