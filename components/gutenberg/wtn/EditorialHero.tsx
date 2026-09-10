import { EditorialHeading } from '@/components/gutenberg/editorial-heading';
import type { EditorialHeadingLevel } from '@/components/gutenberg/editorial-heading';
import {
  EditorialPostImage,
  PostCategory,
  PostPublishedDate,
} from '@/components/gutenberg/wtn/shared';
import type { GutenbergTreeBlock } from '@/lib/gutenberg-tree';

type EditorialHeroBlock = Extract<
  GutenbergTreeBlock,
  { kind: 'wtn-blocks/editorial-hero' }
>;

type EditorialHeroRendererProps = {
  block: EditorialHeroBlock;
  headingLevel: EditorialHeadingLevel;
};

export function EditorialHeroRenderer({
  block,
  headingLevel,
}: EditorialHeroRendererProps) {
  const { resolved } = block;

  if (!resolved) {
    return null;
  }

  const { post } = resolved;
  const hasImage = post.image !== null;
  const mediaLabel = `Abrir matéria: ${post.title}`;

  return (
    <section
      className="wtn-editorial-hero"
      data-media-position={resolved.mediaPosition}
      data-has-media={hasImage ? 'true' : 'false'}
    >
      <div className="wtn-editorial-hero__inner">
        {hasImage ? (
          <a
            className="wtn-editorial-hero__media"
            href={post.uri}
            aria-label={mediaLabel}
          >
            <EditorialPostImage
              image={post.image}
              sizes="(min-width: 1024px) 50vw, 100vw"
              priorityIntent={resolved.prioritizeImage}
            />
          </a>
        ) : null}

        <div className="wtn-editorial-hero__content">
          <p className="wtn-editorial-hero__eyebrow">Destaque</p>

          <EditorialHeading
            level={headingLevel}
            className="wtn-editorial-hero__title"
          >
            <a href={post.uri}>{post.title}</a>
          </EditorialHeading>

          {post.excerpt ? (
            <p className="wtn-editorial-hero__excerpt">{post.excerpt}</p>
          ) : null}

          <div className="wtn-editorial-hero__meta">
            <PostCategory
              category={post.category}
              className="wtn-editorial-hero__meta-item"
            />
            <PostPublishedDate
              publishedAt={post.publishedAt}
              className="wtn-editorial-hero__meta-item"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
