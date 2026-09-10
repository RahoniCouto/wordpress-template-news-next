import { CmsImage } from '@/components/media/CmsImage';
import type {
  WtnResolvedCategory,
  WtnResolvedEditorialPost,
  WtnResolvedImage,
} from '@/lib/gutenberg';

const publishedDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'medium',
  timeZone: 'UTC',
});

const breakingDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'UTC',
});

type PostCategoryProps = {
  category: WtnResolvedCategory | null;
  className?: string;
};

export function PostCategory({ category, className }: PostCategoryProps) {
  if (!category) {
    return null;
  }

  if (category.uri) {
    return (
      <a className={className} href={category.uri}>
        {category.name}
      </a>
    );
  }

  return <span className={className}>{category.name}</span>;
}

type PostPublishedDateProps = {
  publishedAt: string;
  className?: string;
};

export function PostPublishedDate({
  publishedAt,
  className,
}: PostPublishedDateProps) {
  const label = formatPublishedDate(publishedAt);

  if (!label) {
    return null;
  }

  return (
    <time className={className} dateTime={publishedAt}>
      {label}
    </time>
  );
}

type PostReadingTimeProps = {
  minutes: number | null;
  className?: string;
};

export function PostReadingTime({ minutes, className }: PostReadingTimeProps) {
  if (minutes === null || !Number.isSafeInteger(minutes) || minutes <= 0) {
    return null;
  }

  return <span className={className}>{minutes} min de leitura</span>;
}

type EditorialPostImageProps = {
  image: WtnResolvedImage | null;
  sizes?: string;
  className?: string;
  priorityIntent?: boolean;
};

export function EditorialPostImage({
  image,
  sizes,
  className,
  priorityIntent = false,
}: EditorialPostImageProps) {
  if (!image) {
    return null;
  }

  return (
    <CmsImage
      src={image.sourceUrl}
      alt={image.altText}
      width={image.width}
      height={image.height}
      className={className}
      sizes={sizes}
      priorityIntent={priorityIntent}
    />
  );
}

function formatPublishedDate(publishedAt: string): string {
  const date = new Date(publishedAt);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return publishedDateFormatter.format(date);
}

export function formatBreakingTime(
  publishedAt: string,
  currentTimestamp = Date.now(),
): string {
  const publishedTimestamp = new Date(publishedAt).getTime();

  if (!Number.isFinite(publishedTimestamp)) {
    return '';
  }

  const diffSeconds = Math.max(
    0,
    Math.floor((currentTimestamp - publishedTimestamp) / 1000),
  );
  const diffMinutes = Math.floor(diffSeconds / 60);

  if (diffMinutes < 1) {
    return 'agora';
  }

  if (diffMinutes < 60) {
    return `há ${diffMinutes} min`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `há ${diffHours} h`;
  }

  return breakingDateFormatter.format(new Date(publishedTimestamp));
}

export function getAuthorInitials(displayName: string): string {
  const words = displayName.trim().split(/\s+/u).filter(Boolean).slice(0, 2);

  return words
    .map((word) => Array.from(word)[0] ?? '')
    .join('')
    .toLocaleUpperCase('pt-BR');
}

export function getPublishedPostCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'matéria' : 'matérias'}`;
}

export function isResolvedEditorialPost(
  post: WtnResolvedEditorialPost | null,
): post is WtnResolvedEditorialPost {
  return post !== null;
}
