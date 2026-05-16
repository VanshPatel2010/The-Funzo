"use client";

import { useState, useEffect } from "react";

interface FallbackImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc: string;
}

export function FallbackImage({
  fallbackSrc,
  src,
  alt,
  loading,
  ...props
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt || ""}
      loading={loading || "lazy"}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
      {...props}
    />
  );
}
