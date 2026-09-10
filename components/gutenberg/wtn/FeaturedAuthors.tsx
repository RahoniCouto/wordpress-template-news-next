import { EditorialHeading } from '@/components/gutenberg/editorial-heading';
import type { EditorialHeadingLevel } from '@/components/gutenberg/editorial-heading';
import {
  getAuthorInitials,
  getPublishedPostCountLabel,
} from '@/components/gutenberg/wtn/shared';
import { CmsImage } from '@/components/media/CmsImage';
import type { WtnResolvedAuthor } from '@/lib/gutenberg';
import type { GutenbergTreeBlock } from '@/lib/gutenberg-tree';

type FeaturedAuthorsBlock = Extract<
  GutenbergTreeBlock,
  { kind: 'wtn-blocks/featured-authors' }
>;

type FeaturedAuthorsRendererProps = {
  block: FeaturedAuthorsBlock;
  headingLevel: EditorialHeadingLevel;
};

function isResolvedAuthor(
  author: WtnResolvedAuthor | null,
): author is WtnResolvedAuthor {
  return author !== null;
}

export function FeaturedAuthorsRenderer({
  block,
  headingLevel,
}: FeaturedAuthorsRendererProps) {
  const { resolved } = block;

  if (!resolved) {
    return null;
  }

  const authors = (resolved.authors ?? []).filter(isResolvedAuthor);

  if (authors.length === 0) {
    return null;
  }

  return (
    <section
      className="wtn-featured-authors"
      data-author-count={authors.length}
    >
      <header className="wtn-featured-authors__header">
        <EditorialHeading
          level={headingLevel}
          className="wtn-featured-authors__section-title"
        >
          {resolved.title}
        </EditorialHeading>

        {resolved.viewAllUrl ? (
          <a
            className="wtn-featured-authors__view-all"
            href={resolved.viewAllUrl}
          >
            Ver todas
          </a>
        ) : null}
      </header>

      <ul className="wtn-featured-authors__items">
        {authors.map((author) => (
          <li className="wtn-featured-authors__item" key={author.databaseId}>
            <a className="wtn-featured-authors__author-card" href={author.uri}>
              <span className="wtn-featured-authors__avatar" aria-hidden="true">
                {author.avatar ? (
                  <CmsImage
                    src={author.avatar.sourceUrl}
                    alt=""
                    width={author.avatar.width}
                    height={author.avatar.height}
                    sizes="3.5rem"
                  />
                ) : (
                  <span className="wtn-featured-authors__avatar-fallback">
                    {getAuthorInitials(author.displayName)}
                  </span>
                )}
              </span>

              <span className="wtn-featured-authors__content">
                <span className="wtn-featured-authors__name">
                  {author.displayName}
                </span>

                {author.editorialRole ? (
                  <span className="wtn-featured-authors__role">
                    {author.editorialRole}
                  </span>
                ) : null}

                <span className="wtn-featured-authors__post-count">
                  {getPublishedPostCountLabel(author.publishedPostCount)}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
