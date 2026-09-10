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
} from '@/components/gutenberg/wtn/shared';
import type { GutenbergTreeBlock } from '@/lib/gutenberg-tree';

type LatestNewsBlock = Extract<
  GutenbergTreeBlock,
  { kind: 'wtn-blocks/latest-news' }
>;

type LatestNewsRendererProps = {
  block: LatestNewsBlock;
  headingLevel: EditorialHeadingLevel;
};

export function LatestNewsRenderer({
  block,
  headingLevel,
}: LatestNewsRendererProps) {
  const { resolved } = block;

  if (!resolved) {
    return null;
  }

  const posts = (resolved.posts ?? []).filter(isResolvedEditorialPost);

  if (posts.length === 0) {
    return null;
  }

  const postHeadingLevel = getChildEditorialHeadingLevel(headingLevel);
  const isHorizontal = resolved.layoutVariant === 'horizontal';

  return (
    <section
      className="wtn-latest-news"
      data-layout-variant={resolved.layoutVariant}
    >
      <header className="wtn-latest-news__header">
        <EditorialHeading
          level={headingLevel}
          className="wtn-latest-news__section-title"
        >
          {resolved.title}
        </EditorialHeading>

        {resolved.viewAllUrl ? (
          <a className="wtn-latest-news__view-all" href={resolved.viewAllUrl}>
            Ver todas
          </a>
        ) : null}
      </header>

      <div className="wtn-latest-news__items">
        {posts.map((post) => (
          <article
            className="wtn-latest-news__item"
            data-has-media={post.image ? 'true' : 'false'}
            key={post.databaseId}
          >
            {post.image ? (
              <a
                className="wtn-latest-news__media"
                href={post.uri}
                aria-label={`Abrir matéria: ${post.title}`}
              >
                <EditorialPostImage image={post.image} />
              </a>
            ) : null}

            <div className="wtn-latest-news__content">
              {isHorizontal ? (
                <PostCategory
                  category={post.category}
                  className="wtn-latest-news__category"
                />
              ) : null}

              <EditorialHeading
                level={postHeadingLevel}
                className="wtn-latest-news__title"
              >
                <a href={post.uri}>{post.title}</a>
              </EditorialHeading>

              <PostPublishedDate
                publishedAt={post.publishedAt}
                className="wtn-latest-news__date"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
