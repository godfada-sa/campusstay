"use client";

import Image from "next/image";
import { useState } from "react";

type GalleryImage = {
  id: string;
  url: string;
  alt: string | null;
};

export function Gallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center border border-line bg-paper-deep text-muted">
        <span className="text-sm">No photos added yet</span>
      </div>
    );
  }

  const current = images[active] ?? images[0];

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden border border-line bg-paper-deep">
        <Image
          src={current.url}
          alt={current.alt || `${name} photo`}
          fill
          priority
          sizes="(min-width: 1024px) 760px, 100vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 ? (
        <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={index === active}
              className={`relative aspect-[4/3] overflow-hidden border transition-colors ${
                index === active
                  ? "border-forest"
                  : "border-line hover:border-[#b9b3a2]"
              }`}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="150px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
