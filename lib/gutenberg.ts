import { graphqlRequest } from '@/lib/graphql';

export type WtnResolvedImage = {
  databaseId: number | null;
  sourceUrl: string;
  altText: string;
  width: number | null;
  height: number | null;
};

export type WtnResolvedCategory = {
  databaseId: number;
  name: string;
  uri: string | null;
};

export type WtnResolvedEditorialPost = {
  databaseId: number;
  uri: string;
  title: string;
  excerpt: string | null;
  publishedAt: string;
  readingTimeMinutes: number | null;
  image: WtnResolvedImage | null;
  category: WtnResolvedCategory | null;
};

export type WtnResolvedAuthor = {
  databaseId: number;
  uri: string;
  displayName: string;
  editorialRole: string | null;
  publishedPostCount: number;
  avatar: WtnResolvedImage | null;
};

type WtnEditorialHeroResolved = {
  mediaPosition: string;
  prioritizeImage: boolean;
  post: WtnResolvedEditorialPost;
};

type WtnBreakingNewsResolved = {
  label: string;
  post: WtnResolvedEditorialPost;
};

type WtnNewsSectionResolved = {
  layoutVariant: string;
  prioritizeImage: boolean;
  title: string | null;
  viewAllLabel: string | null;
  viewAllUrl: string | null;
  featuredPost: WtnResolvedEditorialPost;
  secondaryPosts: Array<WtnResolvedEditorialPost | null> | null;
};

type WtnLatestNewsResolved = {
  layoutVariant: string;
  title: string;
  viewAllUrl: string | null;
  posts: Array<WtnResolvedEditorialPost | null> | null;
};

type WtnFeaturedAuthorsResolved = {
  title: string;
  viewAllUrl: string | null;
  authors: Array<WtnResolvedAuthor | null> | null;
};

type WtnAdSlotResolved = {
  type: string;
  placement: string;
  format: string;
  width: number;
  height: number;
  image: WtnResolvedImage | null;
  url: string | null;
  adsenseClientId: string | null;
  adSlotId: string | null;
};

type GutenbergBlockKind =
  | 'core/group'
  | 'core/columns'
  | 'core/column'
  | 'core/paragraph'
  | 'core/heading'
  | 'core/image'
  | 'core/quote'
  | 'core/list'
  | 'core/list-item'
  | 'core/buttons'
  | 'core/button'
  | 'core/separator'
  | 'wtn-blocks/editorial-hero'
  | 'wtn-blocks/breaking-news'
  | 'wtn-blocks/news-section'
  | 'wtn-blocks/latest-news'
  | 'wtn-blocks/featured-authors'
  | 'wtn-blocks/ad-slot'
  | 'unknown';

type GutenbergBlockBase<TKind extends GutenbergBlockKind> = {
  kind: TKind;
  __typename: string;
  name: string | null;
  clientId: string | null;
  parentClientId: string | null;
};

type CoreGroupBlock = GutenbergBlockBase<'core/group'> & {
  tagName: string;
};
type CoreColumnsBlock = GutenbergBlockBase<'core/columns'>;
type CoreColumnBlock = GutenbergBlockBase<'core/column'> & {
  width: string | null;
};
type CoreParagraphBlock = GutenbergBlockBase<'core/paragraph'> & {
  content: string | null;
};
type CoreHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type CoreHeadingBlock = GutenbergBlockBase<'core/heading'> & {
  content: string | null;
  level: CoreHeadingLevel;
};
type CoreImageBlock = GutenbergBlockBase<'core/image'> & {
  databaseId: number | null;
  sourceUrl: string | null;
  altText: string;
  width: string | null;
  height: string | null;
  caption: string | null;
  href: string | null;
  linkTarget: string | null;
  rel: string | null;
  title: string | null;
};
type CoreQuoteBlock = GutenbergBlockBase<'core/quote'> & {
  value: string;
  citation: string | null;
};
type CoreListBlock = GutenbergBlockBase<'core/list'> & {
  ordered: boolean;
  reversed: boolean | null;
  start: number | null;
  values: string;
};
type CoreListItemBlock = GutenbergBlockBase<'core/list-item'> & {
  content: string | null;
};
type CoreButtonsBlock = GutenbergBlockBase<'core/buttons'>;
type CoreButtonTagName = 'a' | 'button';

type CoreButtonBlock = GutenbergBlockBase<'core/button'> & {
  text: string | null;
  url: string | null;
  linkTarget: string | null;
  rel: string | null;
  tagName: CoreButtonTagName;
  buttonType: string;
  title: string | null;
};
type CoreSeparatorBlock = GutenbergBlockBase<'core/separator'>;

type WtnEditorialHeroBlock = GutenbergBlockBase<'wtn-blocks/editorial-hero'> & {
  resolved: WtnEditorialHeroResolved | null;
};
type WtnBreakingNewsBlock = GutenbergBlockBase<'wtn-blocks/breaking-news'> & {
  resolved: WtnBreakingNewsResolved | null;
};
type WtnNewsSectionBlock = GutenbergBlockBase<'wtn-blocks/news-section'> & {
  resolved: WtnNewsSectionResolved | null;
};
type WtnLatestNewsBlock = GutenbergBlockBase<'wtn-blocks/latest-news'> & {
  resolved: WtnLatestNewsResolved | null;
};
type WtnFeaturedAuthorsBlock =
  GutenbergBlockBase<'wtn-blocks/featured-authors'> & {
    resolved: WtnFeaturedAuthorsResolved | null;
  };
type WtnAdSlotBlock = GutenbergBlockBase<'wtn-blocks/ad-slot'> & {
  resolved: WtnAdSlotResolved | null;
};

export type UnknownGutenbergBlock = GutenbergBlockBase<'unknown'> & {
  renderedHtml: string | null;
};

export type GutenbergBlock =
  | CoreGroupBlock
  | CoreColumnsBlock
  | CoreColumnBlock
  | CoreParagraphBlock
  | CoreHeadingBlock
  | CoreImageBlock
  | CoreQuoteBlock
  | CoreListBlock
  | CoreListItemBlock
  | CoreButtonsBlock
  | CoreButtonBlock
  | CoreSeparatorBlock
  | WtnEditorialHeroBlock
  | WtnBreakingNewsBlock
  | WtnNewsSectionBlock
  | WtnLatestNewsBlock
  | WtnFeaturedAuthorsBlock
  | WtnAdSlotBlock
  | UnknownGutenbergBlock;

export type GutenbergPage = {
  databaseId: number;
  uri: string | null;
  editorBlocks: GutenbergBlock[];
};

type GutenbergBlockWire = {
  __typename: string;
  name: string | null;
  clientId: string | null;
  parentClientId: string | null;
  width?: string | null;
  tagName?: string;
  databaseId?: number | null;
  sourceUrl?: string | null;
  altText?: string;
  height?: string | null;
  caption?: string | null;
  href?: string | null;
  linkTarget?: string | null;
  rel?: string | null;
  title?: string | null;
  text?: string | null;
  url?: string | null;
  buttonType?: string;
  content?: string | null;
  level?: number;
  value?: string;
  citation?: string | null;
  ordered?: boolean;
  reversed?: boolean | null;
  start?: number | null;
  values?: string;
  editorialHeroResolved?: WtnEditorialHeroResolved | null;
  breakingNewsResolved?: WtnBreakingNewsResolved | null;
  newsSectionResolved?: WtnNewsSectionResolved | null;
  latestNewsResolved?: WtnLatestNewsResolved | null;
  featuredAuthorsResolved?: WtnFeaturedAuthorsResolved | null;
  adSlotResolved?: WtnAdSlotResolved | null;
  renderedHtml?: string | null;
};

type GutenbergPageWire = {
  databaseId: number;
  uri: string | null;
  editorBlocks: Array<GutenbergBlockWire | null> | null;
};

type GutenbergPageData = {
  page: GutenbergPageWire | null;
};

type GutenbergPageVariables = {
  databaseId: number;
};

function getWireField<TValue>(
  block: GutenbergBlockWire,
  field: keyof GutenbergBlockWire,
): TValue {
  if (!(field in block)) {
    throw new Error(
      `GraphQL Gutenberg block ${block.__typename} is missing field ${String(field)}`,
    );
  }

  return block[field] as TValue;
}

function normalizeHeadingLevel(level: number): CoreHeadingLevel {
  if (level >= 1 && level <= 6 && Number.isInteger(level)) {
    return level as CoreHeadingLevel;
  }

  throw new Error(`Unexpected CoreHeading.level value: ${level}`);
}

function normalizeButtonTagName(tagName: string): CoreButtonTagName {
  if (tagName === 'a' || tagName === 'button') {
    return tagName;
  }

  throw new Error(`Unexpected CoreButton.tagName value: ${tagName}`);
}

const GUTENBERG_PAGE_QUERY_TEMPLATE = `
  fragment WtnResolvedImageFields on WtnResolvedImage {
    databaseId
    sourceUrl
    altText
    width
    height
  }

  fragment WtnResolvedCategoryFields on WtnResolvedCategory {
    databaseId
    name
    uri
  }

  fragment WtnResolvedEditorialPostFields on WtnResolvedEditorialPost {
    databaseId
    uri
    title
    excerpt
    publishedAt
    readingTimeMinutes
    image {
      ...WtnResolvedImageFields
    }
    category {
      ...WtnResolvedCategoryFields
    }
  }

  fragment WtnResolvedAuthorFields on WtnResolvedAuthor {
    databaseId
    uri
    displayName
    editorialRole
    publishedPostCount
    avatar {
      ...WtnResolvedImageFields
    }
  }

  query GutenbergPageByDatabaseId($databaseId: ID!) {
    page(id: $databaseId, idType: DATABASE_ID) {
      databaseId
      uri
      editorBlocks(flat: true) {
        __typename
        name
        clientId
        parentClientId

        ... on CoreGroup {
          tagName
        }

        ... on CoreColumn {
          width
        }

        ... on CoreParagraph {
          content
        }

        ... on CoreHeading {
          content
          level
        }

        ... on CoreImage {
          databaseId
          sourceUrl
          altText
          width
          height
          caption
          href
          linkTarget
          rel
          title
        }

        ... on CoreQuote {
          value
          citation
        }

        ... on CoreList {
          ordered
          reversed
          start
          values
        }

        ... on CoreListItem {
          content
        }

        ... on CoreButton {
          text
          url
          linkTarget
          rel
          tagName
          buttonType
          title
        }

        ... on WtnBlocksEditorialHero {
          editorialHeroResolved: resolved {
            mediaPosition
            prioritizeImage
            post {
              ...WtnResolvedEditorialPostFields
            }
          }
        }

        ... on WtnBlocksBreakingNews {
          breakingNewsResolved: resolved {
            label
            post {
              ...WtnResolvedEditorialPostFields
            }
          }
        }

        ... on WtnBlocksNewsSection {
          newsSectionResolved: resolved {
            layoutVariant
            prioritizeImage
            title
            viewAllLabel
            viewAllUrl
            featuredPost {
              ...WtnResolvedEditorialPostFields
            }
            secondaryPosts {
              ...WtnResolvedEditorialPostFields
            }
          }
        }

        ... on WtnBlocksLatestNews {
          latestNewsResolved: resolved {
            layoutVariant
            title
            viewAllUrl
            posts {
              ...WtnResolvedEditorialPostFields
            }
          }
        }

        ... on WtnBlocksFeaturedAuthors {
          featuredAuthorsResolved: resolved {
            title
            viewAllUrl
            authors {
              ...WtnResolvedAuthorFields
            }
          }
        }

        ... on WtnBlocksAdSlot {
          adSlotResolved: resolved {
            type
            placement
            format
            width
            height
            image {
              ...WtnResolvedImageFields
            }
            url
            adsenseClientId
            adSlotId
          }
        }

        # __RENDERED_HTML_FRAGMENTS__
      }
    }
  }
`;

const KNOWN_GUTENBERG_TYPENAMES = new Set([
  'CoreGroup',
  'CoreColumns',
  'CoreColumn',
  'CoreParagraph',
  'CoreHeading',
  'CoreImage',
  'CoreQuote',
  'CoreList',
  'CoreListItem',
  'CoreButtons',
  'CoreButton',
  'CoreSeparator',
  'WtnBlocksEditorialHero',
  'WtnBlocksBreakingNews',
  'WtnBlocksNewsSection',
  'WtnBlocksLatestNews',
  'WtnBlocksFeaturedAuthors',
  'WtnBlocksAdSlot',
]);

const GRAPHQL_TYPE_NAME_PATTERN = /^[_A-Za-z][_0-9A-Za-z]*$/;
const RENDERED_HTML_FRAGMENT_PLACEHOLDER = '# __RENDERED_HTML_FRAGMENTS__';

function isWtnNamespaceWireBlock(block: GutenbergBlockWire): boolean {
  return (
    block.name?.startsWith('wtn-blocks/') === true ||
    block.__typename.startsWith('WtnBlocks')
  );
}

function isKnownGutenbergWireBlock(block: GutenbergBlockWire): boolean {
  return KNOWN_GUTENBERG_TYPENAMES.has(block.__typename);
}

function requireDiscoveryClientId(block: GutenbergBlockWire): string {
  if (block.clientId === null || block.clientId.trim() === '') {
    throw new Error(
      `Cannot safely resolve renderedHtml compatibility for ${block.__typename} without a valid discovery clientId`,
    );
  }

  return block.clientId;
}

function buildDiscoveryBlocksByClientId(page: GutenbergPageWire): {
  blocks: GutenbergBlockWire[];
  blocksByClientId: Map<string, GutenbergBlockWire>;
} {
  const blocks = (page.editorBlocks ?? []).filter(
    (block): block is GutenbergBlockWire => block !== null,
  );
  const blocksByClientId = new Map<string, GutenbergBlockWire>();

  for (const block of blocks) {
    const clientId = requireDiscoveryClientId(block);

    if (blocksByClientId.has(clientId)) {
      throw new Error(
        `Cannot safely resolve renderedHtml compatibility with duplicate discovery clientId "${clientId}"`,
      );
    }

    blocksByClientId.set(clientId, block);
  }

  return { blocks, blocksByClientId };
}

function assertDiscoveryParentChainsAreValid(
  blocks: readonly GutenbergBlockWire[],
  blocksByClientId: ReadonlyMap<string, GutenbergBlockWire>,
): void {
  for (const block of blocks) {
    const clientId = requireDiscoveryClientId(block);
    let parentClientId = block.parentClientId;
    const visitedClientIds = new Set<string>([clientId]);

    while (parentClientId !== null) {
      if (visitedClientIds.has(parentClientId)) {
        throw new Error(
          `Cannot safely resolve renderedHtml compatibility because the discovery tree contains a parent cycle at "${parentClientId}"`,
        );
      }

      const parent = blocksByClientId.get(parentClientId);

      if (!parent) {
        throw new Error(
          `Cannot safely resolve renderedHtml compatibility because Gutenberg block ${block.__typename} references missing parentClientId "${parentClientId}"`,
        );
      }

      visitedClientIds.add(parentClientId);
      parentClientId = parent.parentClientId;
    }
  }
}

function assertCompatibilityBoundariesDoNotContainWtn(
  blocks: readonly GutenbergBlockWire[],
  blocksByClientId: ReadonlyMap<string, GutenbergBlockWire>,
): void {
  for (const block of blocks) {
    if (!isWtnNamespaceWireBlock(block)) {
      continue;
    }

    let parentClientId = block.parentClientId;

    while (parentClientId !== null) {
      const parent = blocksByClientId.get(parentClientId);

      if (!parent) {
        throw new Error(
          `Cannot safely resolve renderedHtml compatibility because WTN block ${block.__typename} references missing parentClientId "${parentClientId}"`,
        );
      }

      if (
        !isKnownGutenbergWireBlock(parent) &&
        !isWtnNamespaceWireBlock(parent)
      ) {
        throw new Error(
          `Unsupported Gutenberg block ${parent.__typename} contains WTN descendant ${block.__typename} and cannot use renderedHtml compatibility`,
        );
      }

      parentClientId = parent.parentClientId;
    }
  }
}

function getCompatibilityTypenames(page: GutenbergPageWire | null): string[] {
  const typenames = new Set<string>();

  for (const block of page?.editorBlocks ?? []) {
    if (
      !block ||
      isKnownGutenbergWireBlock(block) ||
      isWtnNamespaceWireBlock(block)
    ) {
      continue;
    }

    if (!GRAPHQL_TYPE_NAME_PATTERN.test(block.__typename)) {
      throw new Error(
        `Unsupported Gutenberg block has an invalid GraphQL typename: ${block.__typename}`,
      );
    }

    typenames.add(block.__typename);
  }

  if (typenames.size > 0 && page) {
    const { blocks, blocksByClientId } = buildDiscoveryBlocksByClientId(page);

    // Compatibility depends on the discovery tree being structurally reliable.
    // Validate every parent chain before issuing the second GraphQL request,
    // independently of whether a WTN block exists in that chain.
    assertDiscoveryParentChainsAreValid(blocks, blocksByClientId);

    // renderedHtml renders innerBlocks recursively. Reject unsafe compatibility
    // boundaries before issuing the second GraphQL request, otherwise a WTN
    // descendant could already be rendered by PHP before React sees the tree.
    assertCompatibilityBoundariesDoNotContainWtn(blocks, blocksByClientId);
  }

  return [...typenames].sort();
}

function buildRenderedHtmlFragments(typenames: readonly string[]): string {
  return typenames
    .map(
      (typename) => `... on ${typename} {\n          renderedHtml\n        }`,
    )
    .join('\n\n        ');
}

function buildGutenbergPageQuery(
  compatibilityTypenames: readonly string[] = [],
): string {
  return GUTENBERG_PAGE_QUERY_TEMPLATE.replace(
    RENDERED_HTML_FRAGMENT_PLACEHOLDER,
    buildRenderedHtmlFragments(compatibilityTypenames),
  );
}

function normalizeGutenbergBlock(
  block: GutenbergBlockWire | null,
): GutenbergBlock | null {
  if (!block) {
    return null;
  }

  const baseBlock = {
    __typename: block.__typename,
    name: block.name,
    clientId: block.clientId,
    parentClientId: block.parentClientId,
  };

  switch (block.__typename) {
    case 'CoreGroup':
      return {
        ...baseBlock,
        kind: 'core/group',
        tagName: getWireField<string>(block, 'tagName'),
      };

    case 'CoreColumns':
      return {
        ...baseBlock,
        kind: 'core/columns',
      };

    case 'CoreColumn':
      return {
        ...baseBlock,
        kind: 'core/column',
        width: getWireField<string | null>(block, 'width'),
      };

    case 'CoreParagraph':
      return {
        ...baseBlock,
        kind: 'core/paragraph',
        content: getWireField<string | null>(block, 'content'),
      };

    case 'CoreHeading':
      return {
        ...baseBlock,
        kind: 'core/heading',
        content: getWireField<string | null>(block, 'content'),
        level: normalizeHeadingLevel(getWireField<number>(block, 'level')),
      };

    case 'CoreImage':
      return {
        ...baseBlock,
        kind: 'core/image',
        databaseId: getWireField<number | null>(block, 'databaseId'),
        sourceUrl: getWireField<string | null>(block, 'sourceUrl'),
        altText: getWireField<string>(block, 'altText'),
        width: getWireField<string | null>(block, 'width'),
        height: getWireField<string | null>(block, 'height'),
        caption: getWireField<string | null>(block, 'caption'),
        href: getWireField<string | null>(block, 'href'),
        linkTarget: getWireField<string | null>(block, 'linkTarget'),
        rel: getWireField<string | null>(block, 'rel'),
        title: getWireField<string | null>(block, 'title'),
      };

    case 'CoreQuote':
      return {
        ...baseBlock,
        kind: 'core/quote',
        value: getWireField<string>(block, 'value'),
        citation: getWireField<string | null>(block, 'citation'),
      };

    case 'CoreList':
      return {
        ...baseBlock,
        kind: 'core/list',
        ordered: getWireField<boolean>(block, 'ordered'),
        reversed: getWireField<boolean | null>(block, 'reversed'),
        start: getWireField<number | null>(block, 'start'),
        values: getWireField<string>(block, 'values'),
      };

    case 'CoreListItem':
      return {
        ...baseBlock,
        kind: 'core/list-item',
        content: getWireField<string | null>(block, 'content'),
      };

    case 'CoreButtons':
      return {
        ...baseBlock,
        kind: 'core/buttons',
      };

    case 'CoreButton':
      return {
        ...baseBlock,
        kind: 'core/button',
        text: getWireField<string | null>(block, 'text'),
        url: getWireField<string | null>(block, 'url'),
        linkTarget: getWireField<string | null>(block, 'linkTarget'),
        rel: getWireField<string | null>(block, 'rel'),
        tagName: normalizeButtonTagName(getWireField<string>(block, 'tagName')),
        buttonType: getWireField<string>(block, 'buttonType'),
        title: getWireField<string | null>(block, 'title'),
      };

    case 'CoreSeparator':
      return {
        ...baseBlock,
        kind: 'core/separator',
      };

    case 'WtnBlocksEditorialHero':
      return {
        ...baseBlock,
        kind: 'wtn-blocks/editorial-hero',
        resolved: getWireField<WtnEditorialHeroResolved | null>(
          block,
          'editorialHeroResolved',
        ),
      };

    case 'WtnBlocksBreakingNews':
      return {
        ...baseBlock,
        kind: 'wtn-blocks/breaking-news',
        resolved: getWireField<WtnBreakingNewsResolved | null>(
          block,
          'breakingNewsResolved',
        ),
      };

    case 'WtnBlocksNewsSection':
      return {
        ...baseBlock,
        kind: 'wtn-blocks/news-section',
        resolved: getWireField<WtnNewsSectionResolved | null>(
          block,
          'newsSectionResolved',
        ),
      };

    case 'WtnBlocksLatestNews':
      return {
        ...baseBlock,
        kind: 'wtn-blocks/latest-news',
        resolved: getWireField<WtnLatestNewsResolved | null>(
          block,
          'latestNewsResolved',
        ),
      };

    case 'WtnBlocksFeaturedAuthors':
      return {
        ...baseBlock,
        kind: 'wtn-blocks/featured-authors',
        resolved: getWireField<WtnFeaturedAuthorsResolved | null>(
          block,
          'featuredAuthorsResolved',
        ),
      };

    case 'WtnBlocksAdSlot':
      return {
        ...baseBlock,
        kind: 'wtn-blocks/ad-slot',
        resolved: getWireField<WtnAdSlotResolved | null>(
          block,
          'adSlotResolved',
        ),
      };

    default:
      return {
        ...baseBlock,
        kind: 'unknown',
        renderedHtml: isWtnNamespaceWireBlock(block)
          ? null
          : getWireField<string | null>(block, 'renderedHtml'),
      };
  }
}

function normalizeGutenbergPage(
  page: GutenbergPageWire | null,
): GutenbergPage | null {
  if (!page) {
    return null;
  }

  const editorBlocks =
    page.editorBlocks
      ?.map(normalizeGutenbergBlock)
      .filter((block): block is GutenbergBlock => block !== null) ?? [];

  return {
    databaseId: page.databaseId,
    uri: page.uri,
    editorBlocks,
  };
}

export async function getGutenbergPage(
  databaseId: number,
): Promise<GutenbergPage | null> {
  const variables = { databaseId };
  const discoveryData = await graphqlRequest<
    GutenbergPageData,
    GutenbergPageVariables
  >(buildGutenbergPageQuery(), variables);
  const compatibilityTypenames = getCompatibilityTypenames(discoveryData.page);

  if (compatibilityTypenames.length === 0) {
    return normalizeGutenbergPage(discoveryData.page);
  }

  const canonicalData = await graphqlRequest<
    GutenbergPageData,
    GutenbergPageVariables
  >(buildGutenbergPageQuery(compatibilityTypenames), variables);

  return normalizeGutenbergPage(canonicalData.page);
}
