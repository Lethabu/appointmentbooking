'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getAssetPath } from '@/utils/assetPaths';

/**
 * TenantImage component with error handling and fallback
 */
interface TenantImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
  fill?: boolean;
}

export function TenantImage({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc = '/placeholder.svg',
  priority = false,
  fill = false,
  ...props
}: TenantImageProps) {
  const [imgSrc, setImgSrc] = useState(getAssetPath(src));
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(getAssetPath(fallbackSrc));
    }
  };

  const imageProps = {
    src: imgSrc,
    alt,
    className,
    onError: handleError,
    priority,
    ...props,
  };

  if (fill) {
    return <Image {...imageProps} fill alt={alt} />;
  }

  return (
    <Image
      {...imageProps}
      alt={alt}
      width={width || 400}
      height={height || 300}
    />
  );
}