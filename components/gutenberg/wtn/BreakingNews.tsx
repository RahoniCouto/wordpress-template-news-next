import { EditorialHeading } from '@/components/gutenberg/editorial-heading';
import type { EditorialHeadingLevel } from '@/components/gutenberg/editorial-heading';
import { formatBreakingTime } from '@/components/gutenberg/wtn/shared';
import type { GutenbergTreeBlock } from '@/lib/gutenberg-tree';

type BreakingNewsBlock = Extract<
  GutenbergTreeBlock,
  { kind: 'wtn-blocks/breaking-news' }
>;

type BreakingNewsRendererProps = {
  block: BreakingNewsBlock;
  headingLevel: EditorialHeadingLevel;
};

export function BreakingNewsRenderer({
  block,
  headingLevel,
}: BreakingNewsRendererProps) {
  const { resolved } = block;

  if (!resolved) {
    return null;
  }

  const { post } = resolved;
  const timeLabel = formatBreakingTime(post.publishedAt);

  return (
    <section className="wtn-breaking-news">
      <div className="wtn-breaking-news__inner">
        <div className="wtn-breaking-news__badge">
          <span className="wtn-breaking-news__icon" aria-hidden="true">
            ⚡
          </span>
          <span className="wtn-breaking-news__label">{resolved.label}</span>
        </div>

        <a className="wtn-breaking-news__link" href={post.uri}>
          <EditorialHeading
            level={headingLevel}
            className="wtn-breaking-news__headline"
          >
            {post.title}
          </EditorialHeading>

          {timeLabel ? (
            <time
              className="wtn-breaking-news__time"
              dateTime={post.publishedAt}
            >
              {timeLabel}
            </time>
          ) : null}

          <span className="wtn-breaking-news__cta" aria-hidden="true">
            ›
          </span>
        </a>
      </div>
    </section>
  );
}
