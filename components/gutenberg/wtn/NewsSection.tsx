import {
  EditorialHeading,
  getChildEditorialHeadingLevel,
} from '@/components/gutenberg/editorial-heading';
import type { EditorialHeadingLevel } from '@/components/gutenberg/editorial-heading';
import {
  EditorialPostImage,
  isResolvedEditorialPost,
  PostCategory,
  PostPublishedDate,
  PostReadingTime,
} from '@/components/gutenberg/wtn/shared';
import type { WtnResolvedEditorialPost } from '@/lib/gutenberg';
import type { GutenbergTreeBlock } from '@/lib/gutenberg-tree';

type NewsSectionBlock = Extract<
  GutenbergTreeBlock,
  { kind: 'wtn-blocks/news-section' }
>;

type NewsSectionRendererProps = {
  block: NewsSectionBlock;
  headingLevel: EditorialHeadingLevel;
};

type NewsPostMetaProps = {
  post: WtnResolvedEditorialPost;
  className: string;
};

function NewsPostMeta({ post, className }: NewsPostMetaProps) {
  return (
    <div className={className}>
      <PostPublishedDate publishedAt={post.publishedAt} />
      <PostReadingTime minutes={post.readingTimeMinutes} />
    </div>
  );
}

export function NewsSectionRenderer({
  block,
  headingLevel,
}: NewsSectionRendererProps) {
  const { resolved } = block;

  if (!resolved) {
    return null;
  }

  const sectionTitle = resolved.title?.trim() ?? '';
  const hasSectionTitle = sectionTitle !== '';
  const featuredHeadingLevel = hasSectionTitle
    ? getChildEditorialHeadingLevel(headingLevel)
    : headingLevel;
  const secondaryHeadingLevel = hasSectionTitle
    ? featuredHeadingLevel
    : getChildEditorialHeadingLevel(featuredHeadingLevel);
  const secondaryPosts = (resolved.secondaryPosts ?? []).filter(
    isResolvedEditorialPost,
  );
  const { featuredPost } = resolved;
  const featuredImage = featuredPost.image;
  const hasHeader =
    hasSectionTitle ||
    (Boolean(resolved.viewAllUrl) && Boolean(resolved.viewAllLabel));

  return (
    <section
      className="wtn-news-section"
      data-layout-variant={resolved.layoutVariant}
      data-has-title={hasSectionTitle ? 'true' : 'false'}
    >
      {hasHeader ? (
        <header className="wtn-news-section__header">
          {hasSectionTitle ? (
            <EditorialHeading
              level={headingLevel}
              className="wtn-news-section__section-title"
            >
              {sectionTitle}
            </EditorialHeading>
          ) : null}

          {resolved.viewAllUrl && resolved.viewAllLabel ? (
            <a
              className="wtn-news-section__view-all"
              href={resolved.viewAllUrl}
            >
              <span>{resolved.viewAllLabel}</span>
              <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </header>
      ) : null}

      <article
        className="wtn-news-section__featured-card"
        data-has-media={featuredImage ? 'true' : 'false'}
      >
        {featuredImage ? (
          <a
            className="wtn-news-section__featured-media"
            href={featuredPost.uri}
            aria-label={`Abrir matéria: ${featuredPost.title}`}
          >
            <EditorialPostImage
              image={featuredImage}
              sizes="(min-width: 782px) 55vw, 100vw"
              priorityIntent={resolved.prioritizeImage}
            />
          </a>
        ) : null}

        <div className="wtn-news-section__featured-content">
          <PostCategory
            category={featuredPost.category}
            className="wtn-news-section__featured-category"
          />

          <EditorialHeading
            level={featuredHeadingLevel}
            className="wtn-news-section__featured-title"
          >
            <a href={featuredPost.uri}>{featuredPost.title}</a>
          </EditorialHeading>

          {featuredPost.excerpt ? (
            <p className="wtn-news-section__featured-excerpt">
              {featuredPost.excerpt}
            </p>
          ) : null}

          <NewsPostMeta
            post={featuredPost}
            className="wtn-news-section__featured-meta"
          />
        </div>
      </article>

      {secondaryPosts.length > 0 ? (
        <div className="wtn-news-section__secondary-list">
          {secondaryPosts.map((post) => (
            <article
              className="wtn-news-section__secondary-card"
              data-has-media={post.image ? 'true' : 'false'}
              key={post.databaseId}
            >
              {post.image ? (
                <a
                  className="wtn-news-section__secondary-media"
                  href={post.uri}
                  aria-label={`Abrir matéria: ${post.title}`}
                >
                  <EditorialPostImage
                    image={post.image}
                    sizes="(min-width: 782px) 30vw, 36vw"
                  />
                </a>
              ) : null}

              <div className="wtn-news-section__secondary-content">
                <PostCategory
                  category={post.category}
                  className="wtn-news-section__secondary-category"
                />

                <EditorialHeading
                  level={secondaryHeadingLevel}
                  className="wtn-news-section__secondary-title"
                >
                  <a href={post.uri}>{post.title}</a>
                </EditorialHeading>

                <NewsPostMeta
                  post={post}
                  className="wtn-news-section__secondary-meta"
                />
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
