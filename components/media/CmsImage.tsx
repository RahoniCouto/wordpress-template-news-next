/* eslint-disable @next/next/no-img-element -- Native img is an intentional fallback when the CMS source cannot safely use the Next image optimizer. */
import Image from 'next/image';

type CmsImageProps = {
  src: string;
  alt: string;
  width: number | null;
  height: number | null;
  title?: string | null;
  className?: string;
  sizes?: string;
  priorityIntent?: boolean;
};

function normalizeIntrinsicDimension(value: number | null): number | null {
  if (value === null || !Number.isSafeInteger(value) || value <= 0) {
    return null;
  }

  return value;
}

function getConfiguredMediaOrigin(): string | null {
  const configuredUrl =
    process.env.WORDPRESS_MEDIA_URL ?? process.env.WORDPRESS_GRAPHQL_URL;

  if (!configuredUrl) {
    return null;
  }

  try {
    const url = new URL(configuredUrl);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

function canUseNextImage(src: string): boolean {
  if (src.startsWith('/')) {
    return true;
  }

  const configuredMediaOrigin = getConfiguredMediaOrigin();

  if (!configuredMediaOrigin) {
    return false;
  }

  try {
    const sourceUrl = new URL(src);

    return (
      (sourceUrl.protocol === 'http:' || sourceUrl.protocol === 'https:') &&
      sourceUrl.origin === configuredMediaOrigin
    );
  } catch {
    return false;
  }
}

export function CmsImage({
  src,
  alt,
  width,
  height,
  title,
  className,
  sizes,
  priorityIntent = false,
}: CmsImageProps) {
  const normalizedSrc = src.trim();

  if (!normalizedSrc) {
    return null;
  }

  const intrinsicWidth = normalizeIntrinsicDimension(width);
  const intrinsicHeight = normalizeIntrinsicDimension(height);
  const canOptimize =
    intrinsicWidth !== null &&
    intrinsicHeight !== null &&
    canUseNextImage(normalizedSrc);

  if (canOptimize) {
    return (
      <Image
        src={normalizedSrc}
        alt={alt}
        width={intrinsicWidth}
        height={intrinsicHeight}
        title={title ?? undefined}
        className={className}
        sizes={sizes}
        loading={priorityIntent ? 'eager' : undefined}
        fetchPriority={priorityIntent ? 'high' : undefined}
      />
    );
  }

  return (
    <img
      src={normalizedSrc}
      alt={alt}
      width={intrinsicWidth ?? undefined}
      height={intrinsicHeight ?? undefined}
      title={title ?? undefined}
      className={className}
      loading={priorityIntent ? 'eager' : 'lazy'}
      fetchPriority={priorityIntent ? 'high' : undefined}
    />
  );
}
