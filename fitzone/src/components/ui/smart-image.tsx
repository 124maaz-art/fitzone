"use client";

import * as React from "react";
import Image from "next/image";

const FALLBACK = "/images/fallback.svg";

export function SmartImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  priority,
  sizes,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}) {
  const [error, setError] = React.useState(false);
  const actualSrc = error || !src ? FALLBACK : src;

  React.useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <Image
      src={actualSrc}
      alt={alt}
      className={className}
      fill={fill}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      onError={() => setError(true)}
    />
  );
}
