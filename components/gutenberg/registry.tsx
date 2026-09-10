import type { ReactNode } from 'react';

import {
  CoreButtonRenderer,
  CoreButtonsRenderer,
  CoreColumnRenderer,
  CoreColumnsRenderer,
  CoreGroupRenderer,
  CoreHeadingRenderer,
  CoreImageRenderer,
  CoreListItemRenderer,
  CoreListRenderer,
  CoreParagraphRenderer,
  CoreQuoteRenderer,
  CoreSeparatorRenderer,
} from '@/components/gutenberg/core-renderers';
import type { EditorialHeadingLevel } from '@/components/gutenberg/editorial-heading';
import { AdSlotRenderer } from '@/components/gutenberg/wtn/AdSlot';
import { BreakingNewsRenderer } from '@/components/gutenberg/wtn/BreakingNews';
import { EditorialHeroRenderer } from '@/components/gutenberg/wtn/EditorialHero';
import { FeaturedAuthorsRenderer } from '@/components/gutenberg/wtn/FeaturedAuthors';
import { LatestNewsRenderer } from '@/components/gutenberg/wtn/LatestNews';
import { NewsSectionRenderer } from '@/components/gutenberg/wtn/NewsSection';
import type { GutenbergTreeBlock } from '@/lib/gutenberg-tree';

type KnownGutenbergBlockKind = Exclude<GutenbergTreeBlock['kind'], 'unknown'>;

type KnownGutenbergTreeBlock = Exclude<GutenbergTreeBlock, { kind: 'unknown' }>;

type BlockOfKind<TKind extends KnownGutenbergBlockKind> = Extract<
  KnownGutenbergTreeBlock,
  { kind: TKind }
>;

type GutenbergRegistryRenderContext = {
  block: KnownGutenbergTreeBlock;
  children: ReactNode;
  headingLevel: EditorialHeadingLevel | null;
};

type GutenbergRegistryEntry = {
  supportsChildren: boolean;
  rendersEditorialHeading: (block: KnownGutenbergTreeBlock) => boolean;
  render: (context: GutenbergRegistryRenderContext) => ReactNode;
};

type RegistryEntryConfig<TKind extends KnownGutenbergBlockKind> = {
  supportsChildren: boolean;
  rendersEditorialHeading?: (block: BlockOfKind<TKind>) => boolean;
  render: (context: {
    block: BlockOfKind<TKind>;
    children: ReactNode;
    headingLevel: EditorialHeadingLevel | null;
  }) => ReactNode;
};

function defineRegistryEntry<TKind extends KnownGutenbergBlockKind>(
  kind: TKind,
  config: RegistryEntryConfig<TKind>,
): GutenbergRegistryEntry {
  return {
    supportsChildren: config.supportsChildren,
    rendersEditorialHeading(block) {
      if (block.kind !== kind) {
        throw new Error(
          `Gutenberg registry expected ${kind}, received ${block.kind}`,
        );
      }

      return config.rendersEditorialHeading
        ? config.rendersEditorialHeading(block as BlockOfKind<TKind>)
        : false;
    },
    render(context) {
      if (context.block.kind !== kind) {
        throw new Error(
          `Gutenberg registry expected ${kind}, received ${context.block.kind}`,
        );
      }

      return config.render({
        ...context,
        block: context.block as BlockOfKind<TKind>,
      });
    },
  };
}

function requireHeadingLevel(
  kind: KnownGutenbergBlockKind,
  headingLevel: EditorialHeadingLevel | null,
): EditorialHeadingLevel {
  if (headingLevel === null) {
    throw new Error(
      `Gutenberg block ${kind} is missing its editorial heading level`,
    );
  }

  return headingLevel;
}

function latestNewsHasRenderablePosts(
  block: BlockOfKind<'wtn-blocks/latest-news'>,
): boolean {
  return (block.resolved?.posts ?? []).some((post) => post !== null);
}

function featuredAuthorsHasRenderableAuthors(
  block: BlockOfKind<'wtn-blocks/featured-authors'>,
): boolean {
  return (block.resolved?.authors ?? []).some((author) => author !== null);
}

export const gutenbergRegistry = {
  'core/group': defineRegistryEntry('core/group', {
    supportsChildren: true,
    render: ({ block, children }) => (
      <CoreGroupRenderer block={block}>{children}</CoreGroupRenderer>
    ),
  }),

  'core/columns': defineRegistryEntry('core/columns', {
    supportsChildren: true,
    render: ({ block, children }) => (
      <CoreColumnsRenderer block={block}>{children}</CoreColumnsRenderer>
    ),
  }),

  'core/column': defineRegistryEntry('core/column', {
    supportsChildren: true,
    render: ({ block, children }) => (
      <CoreColumnRenderer block={block}>{children}</CoreColumnRenderer>
    ),
  }),

  'core/paragraph': defineRegistryEntry('core/paragraph', {
    supportsChildren: false,
    render: ({ block }) => <CoreParagraphRenderer block={block} />,
  }),

  'core/heading': defineRegistryEntry('core/heading', {
    supportsChildren: false,
    render: ({ block }) => <CoreHeadingRenderer block={block} />,
  }),

  'core/image': defineRegistryEntry('core/image', {
    supportsChildren: false,
    render: ({ block }) => <CoreImageRenderer block={block} />,
  }),

  'core/quote': defineRegistryEntry('core/quote', {
    supportsChildren: true,
    render: ({ block, children }) => (
      <CoreQuoteRenderer block={block}>{children}</CoreQuoteRenderer>
    ),
  }),

  'core/list': defineRegistryEntry('core/list', {
    supportsChildren: true,
    render: ({ block, children }) => (
      <CoreListRenderer block={block}>{children}</CoreListRenderer>
    ),
  }),

  'core/list-item': defineRegistryEntry('core/list-item', {
    supportsChildren: true,
    render: ({ block, children }) => (
      <CoreListItemRenderer block={block}>{children}</CoreListItemRenderer>
    ),
  }),

  'core/buttons': defineRegistryEntry('core/buttons', {
    supportsChildren: true,
    render: ({ block, children }) => (
      <CoreButtonsRenderer block={block}>{children}</CoreButtonsRenderer>
    ),
  }),

  'core/button': defineRegistryEntry('core/button', {
    supportsChildren: false,
    render: ({ block }) => <CoreButtonRenderer block={block} />,
  }),

  'core/separator': defineRegistryEntry('core/separator', {
    supportsChildren: false,
    render: () => <CoreSeparatorRenderer />,
  }),

  'wtn-blocks/editorial-hero': defineRegistryEntry(
    'wtn-blocks/editorial-hero',
    {
      supportsChildren: false,
      rendersEditorialHeading: (block) => block.resolved !== null,
      render: ({ block, headingLevel }) => (
        <EditorialHeroRenderer
          block={block}
          headingLevel={requireHeadingLevel(block.kind, headingLevel)}
        />
      ),
    },
  ),

  'wtn-blocks/breaking-news': defineRegistryEntry('wtn-blocks/breaking-news', {
    supportsChildren: false,
    rendersEditorialHeading: (block) => block.resolved !== null,
    render: ({ block, headingLevel }) => (
      <BreakingNewsRenderer
        block={block}
        headingLevel={requireHeadingLevel(block.kind, headingLevel)}
      />
    ),
  }),

  'wtn-blocks/news-section': defineRegistryEntry('wtn-blocks/news-section', {
    supportsChildren: false,
    rendersEditorialHeading: (block) => block.resolved !== null,
    render: ({ block, headingLevel }) => (
      <NewsSectionRenderer
        block={block}
        headingLevel={requireHeadingLevel(block.kind, headingLevel)}
      />
    ),
  }),

  'wtn-blocks/latest-news': defineRegistryEntry('wtn-blocks/latest-news', {
    supportsChildren: false,
    rendersEditorialHeading: latestNewsHasRenderablePosts,
    render: ({ block, headingLevel }) => {
      if (!latestNewsHasRenderablePosts(block)) {
        return null;
      }

      return (
        <LatestNewsRenderer
          block={block}
          headingLevel={requireHeadingLevel(block.kind, headingLevel)}
        />
      );
    },
  }),

  'wtn-blocks/featured-authors': defineRegistryEntry(
    'wtn-blocks/featured-authors',
    {
      supportsChildren: false,
      rendersEditorialHeading: featuredAuthorsHasRenderableAuthors,
      render: ({ block, headingLevel }) => {
        if (!featuredAuthorsHasRenderableAuthors(block)) {
          return null;
        }

        return (
          <FeaturedAuthorsRenderer
            block={block}
            headingLevel={requireHeadingLevel(block.kind, headingLevel)}
          />
        );
      },
    },
  ),

  'wtn-blocks/ad-slot': defineRegistryEntry('wtn-blocks/ad-slot', {
    supportsChildren: false,
    render: ({ block }) => <AdSlotRenderer block={block} />,
  }),
} satisfies Record<KnownGutenbergBlockKind, GutenbergRegistryEntry>;
