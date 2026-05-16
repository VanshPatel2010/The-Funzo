"use client";

import { useState } from "react";
import { FallbackImage } from "@/components/ui";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      <div className="w-full h-96 rounded-lg overflow-hidden border border-[#333333] bg-[#252525]">
        <FallbackImage
          src={images[selectedImage]}
          alt={`${name} for sale at cycle shop in Gandhinagar image ${selectedImage + 1}`}
          width={800}
          height={600}
          className="w-full h-full object-cover"
          fallbackSrc="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, idx) => (
            <button
              key={`${image}-${idx}`}
              type="button"
              onClick={() => setSelectedImage(idx)}
              className={`h-24 overflow-hidden rounded-lg border bg-[#252525] transition ${
                selectedImage === idx
                  ? "border-[#E84A2F]"
                  : "border-[#333333] hover:border-[#666666]"
              }`}
            >
              <FallbackImage
                src={image}
                alt={`${name} thumbnail at bicycle shop Gandhinagar ${idx + 1}`}
                width={150}
                height={150}
                className="w-full h-full object-cover"
                fallbackSrc="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
